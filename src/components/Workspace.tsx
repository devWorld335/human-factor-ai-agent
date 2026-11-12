import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Markdown } from "./markdown";

type Kind = "personal" | "code" | "design";
type MediaKind = "image" | "video";

export type WorkFile = { path: string; language: string; content: string };
export type WorkMedia = { kind: MediaKind; url: string };

export type WorkMessage = {
  role: "user" | "assistant";
  content: string;
  at: string;
  files?: WorkFile[];
  media?: WorkMedia[];
};

export type WorkAgent = {
  id: string;
  name: string;
  kind: Kind;
  plan?: "free" | "pro";
  credits?: { daily: number; used: number; remaining: number } | null;
};

export type WorkChat = {
  id: string;
  title: string;
  updatedAt: string;
};

type Turn = { message: string; brief?: string; media?: MediaKind };

const KIND_LABEL: Record<Kind, string> = {
  personal: "Personal",
  code: "Code",
  design: "Design",
};

const EMPTY = "A conversation. Ask something, think it through, and pick it up again later.";

export function Workspace({
  username,
  agents,
  activeId,
  chats,
  chatId,
  messages,
  pending,
  error,
  onSelect,
  onCreate,
  canCreate,
  onOpenChat,
  onNewChat,
  onSignOut,
  onSend,
}: {
  username: string;
  agents: WorkAgent[];
  activeId: string | null;
  chats: WorkChat[];
  chatId: string | null;
  messages: WorkMessage[];
  pending: boolean;
  error: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  canCreate: boolean;
  onOpenChat: (id: string) => void;
  onNewChat: () => void;
  onSignOut: () => void;
  onSend: (turn: Turn) => Promise<boolean>;
}) {
  const live = agents.filter((agent) => agent.kind === "personal");
  const active = live.find((agent) => agent.id === activeId) ?? null;
  const plan = active?.plan === "pro" ? "PRO" : "FREE";
  const credits =
    active?.plan === "pro" && active.credits ? ` · ${active.credits.remaining} / ${active.credits.daily} LEFT TODAY` : "";
  const current = chats.find((chat) => chat.id === chatId);
  const title = messages.length === 0 && !current ? "New chat" : current?.title || active?.name || "New chat";

  return (
    <div className="workspace">
      <aside className="workspace-rail">
        {canCreate ? (
          <button className="workspace-new" type="button" onClick={onCreate}>
            New agent <span>↗</span>
          </button>
        ) : (
          <button className="workspace-new" type="button" onClick={onNewChat} disabled={pending || (chatId === null && messages.length === 0)}>
            New chat <span>↗</span>
          </button>
        )}
        {live.length > 1 && (
          <div className="workspace-agents" role="tablist" aria-label="Your agents">
            {live.map((agent) => (
              <button key={agent.id} type="button" role="tab" aria-selected={agent.id === activeId} onClick={() => onSelect(agent.id)}>
                <strong>{agent.name}</strong>
              </button>
            ))}
          </div>
        )}
        <div className="workspace-nav">
          <div>
            <span>Code</span>
            <small>Soon</small>
          </div>
          <div>
            <span>Design</span>
            <small>Soon</small>
          </div>
        </div>
        {active && (
          <>
            <p className="mono">Recents</p>
            <div className="workspace-history" role="tablist" aria-label="Recents">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  role="tab"
                  aria-selected={chat.id === chatId}
                  title={chatWhen(chat.updatedAt)}
                  disabled={pending}
                  onClick={() => onOpenChat(chat.id)}
                >
                  <strong>{chat.title}</strong>
                </button>
              ))}
              {chats.length === 0 && <p className="workspace-history-empty">Chats you start are kept here.</p>}
            </div>
          </>
        )}
        <div className="workspace-rail-foot">
          <div className="workspace-user">
            <span aria-hidden="true">{username.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{username}</strong>
              <small>
                {active ? `${active.name} · ${plan === "PRO" ? "Pro" : "Free"}` : "Personal"}
                {credits}
              </small>
            </div>
          </div>
          <a href="/">Return home</a>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      <section className="workspace-stage" aria-label={active ? active.name : "Agent workspace"}>
        {!active ? (
          <div className="workspace-empty">
            <p className="mono">NO AGENT YET</p>
            <h2>Create one to start.</h2>
          </div>
        ) : (
          <>
            <header className="workspace-head">
              <p className="mono">{KIND_LABEL[active.kind].toUpperCase()}</p>
              <h2>{title}</h2>
              <p className="mono">
                {plan}
                {credits}
              </p>
            </header>
            <Talk username={username} messages={messages} pending={pending} error={error} onSend={onSend} />
          </>
        )}
      </section>
    </div>
  );
}

function Talk({
  username,
  messages,
  pending,
  error,
  onSend,
}: {
  username: string;
  messages: WorkMessage[];
  pending: boolean;
  error: string;
  onSend: (turn: Turn) => Promise<boolean>;
}) {
  const log = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = String(new FormData(form).get("message") ?? "").trim();
    if (!message || pending) return;
    const ok = await onSend({ message });
    if (ok) {
      form.reset();
      if (box.current) box.current.style.height = "auto";
    }
  };

  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const grow = (event: FormEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="talk">
      <div className="talk-log" ref={log}>
        <div className="talk-stream" role="log" aria-live="polite">
          {messages.length === 0 && (
            <div className="talk-hello">
              <p className="mono">PERSONAL AGENT</p>
              <h2>Hello {username}.</h2>
              <p>{EMPTY}</p>
            </div>
          )}
          {messages.map((item, index) =>
            item.role === "user" ? (
              <p key={`${item.at}-${index}`} className="talk-msg user">
                {item.content}
              </p>
            ) : (
              <div key={`${item.at}-${index}`} className="talk-msg assistant">
                <Markdown text={item.content} />
              </div>
            ),
          )}
          {pending && <p className="talk-msg assistant talk-pending">Writing…</p>}
        </div>
      </div>
      <div className="talk-compose">
        <form onSubmit={submit}>
          <div className="talk-box">
            <label className="sr-only" htmlFor="talk-message">
              Message
            </label>
            <textarea
              id="talk-message"
              ref={box}
              name="message"
              rows={1}
              maxLength={4000}
              required
              placeholder="Message"
              disabled={pending}
              onKeyDown={onKey}
              onInput={grow}
            />
            <button type="submit" disabled={pending} aria-label={pending ? "Sending" : "Send"}>
              {pending ? "…" : "↗"}
            </button>
          </div>
        </form>
        {error && <Notice error={error} />}
      </div>
    </div>
  );
}

function Notice({ error }: { error: string }) {
  const credit = /credit/i.test(error);
  if (!credit) {
    return (
      <p className="signin-error" role="alert">
        {error}
      </p>
    );
  }
  return (
    <p className="credit-note" role="alert">
      <span>CREDITS</span>
      {error}
    </p>
  );
}

function chatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

