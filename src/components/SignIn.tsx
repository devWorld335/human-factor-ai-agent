import { useLoginWithOAuth, usePrivy } from "@privy-io/react-auth";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Workspace, type WorkAgent, type WorkChat, type WorkMessage } from "./Workspace";

type Provider = "password" | "google" | "apple";
type Mode = "signin" | "signup";

type User = {
  id: string;
  username: string;
  provider: Provider;
};

type Kind = "personal" | "code" | "design";

const KIND_LABEL: Record<Kind, string> = {
  personal: "Personal",
  code: "Code",
  design: "Design",
};

const KINDS = Object.keys(KIND_LABEL) as Kind[];

function openKind(list: { kind: Kind }[]): Kind | null {
  return list.some((item) => item.kind === "personal") ? null : "personal";
}

const KIND_HEAD: Record<Kind, string> = {
  personal: "PERSONAL\nAGENT.",
  code: "CODE\nAGENT.",
  design: "DESIGN\nAGENT.",
};

const KIND_COPY: Record<Kind, string> = {
  personal: "A conversation. You talk, and the agent answers in the thread.",
  code: "You give a prompt and the requirements. The agent returns the code and the file structure.",
  design: "You give a prompt and the requirements. The agent shows an image or a video.",
};

const DAILY_CREDITS = 5;
const AGENT_PAGE = "/agents";

function pagePath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function requestedKind(): Kind | null {
  const value = new URLSearchParams(window.location.search).get("agent");
  return value === "personal" ? "personal" : null;
}

const OAUTH_ERRORS: Record<string, string> = {
  google_unconfigured:
    "Google sign-in needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the server. A username still works.",
  apple_unconfigured:
    "Apple sign-in needs the Apple client id, team id, key id, and private key. A username still works.",
  oauth_failed: "That sign-in did not finish. Try again, or use a username.",
};

function privyError(error: unknown) {
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message) return error.message;
  return "That sign-in did not finish. Try again.";
}

function GoogleMark() {
  return (
    <svg className="signin-mark" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg className="signin-mark" viewBox="0 0 14 17" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.37 8.92c-.02-2.16 1.76-3.2 1.84-3.25-1-1.47-2.57-1.67-3.12-1.69-1.33-.14-2.6.78-3.27.78-.68 0-1.72-.76-2.83-.74-1.45.02-2.8.85-3.55 2.15-1.52 2.63-.39 6.53 1.09 8.67.72 1.04 1.58 2.21 2.71 2.17 1.09-.05 1.5-.7 2.81-.7 1.31 0 1.68.7 2.82.68 1.17-.02 1.91-1.06 2.63-2.11.83-1.2 1.17-2.37 1.19-2.43-.03-.01-2.28-.87-2.3-3.53zM9.55 2.72c.6-.72.99-1.73.89-2.72-.85.03-1.89.57-2.5 1.29-.55.64-1.03 1.66-.9 2.64.95.07 1.92-.48 2.51-1.21z"
      />
    </svg>
  );
}

async function postJson(path: string, body: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(data.error || "The request failed.");
  return data;
}

export function SignIn({ initialMode }: { initialMode: Mode }) {
  const emailId = useId();
  const passwordId = useId();
  const nameId = useId();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [user, setUser] = useState<User | null>(null);
  const [agents, setAgents] = useState<WorkAgent[]>([]);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [kind, setKind] = useState<Kind>(requestedKind() ?? "personal");
  const [messages, setMessages] = useState<WorkMessage[]>([]);
  const [chats, setChats] = useState<WorkChat[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const leaving = useRef(false);
  const adoptRef = useRef<() => Promise<void>>(async () => undefined);
  const { ready: privyReady, authenticated, getAccessToken, logout } = usePrivy();
  const { initOAuth, state: oauthState } = useLoginWithOAuth({
    onComplete: ({ wasAlreadyAuthenticated }) => {
      if (wasAlreadyAuthenticated || leaving.current) return;
      void adoptRef.current();
    },
    onError: (error) => {
      setPending(false);
      setError(privyError(error));
    },
  });

  const openThread = async (id: string, nextChat?: string) => {
    const query = new URLSearchParams({ id });
    if (nextChat) query.set("chat", nextChat);
    const thread = await fetch(`/api/agent?${query}`);
    if (!thread.ok) return;
    const history = (await thread.json()) as { messages?: WorkMessage[]; chats?: WorkChat[]; chatId?: string | null };
    setMessages(history.messages ?? []);
    setChats(history.chats ?? []);
    setChatId(history.chatId ?? null);
  };

  const loadAgents = async () => {
    const response = await fetch("/api/agents");
    if (!response.ok) return;
    const data = (await response.json()) as { agents?: WorkAgent[] };
    const list = data.agents ?? [];
    setAgents(list);
    const match = list.find((item) => item.kind === "personal") ?? null;
    if (!match) {
      setCreating(true);
      setKind("personal");
      setAgentId(null);
      setMessages([]);
      setChats([]);
      setChatId(null);
      return;
    }
    setAgentId(match.id);
    setKind("personal");
    setCreating(false);
    await openThread(match.id);
  };

  useEffect(() => {
    const previous = document.title;
    document.title = user
      ? creating
        ? "Create agent — Humanfator"
        : "Your agent — Humanfator"
      : mode === "signup"
        ? "Create account — Humanfator"
        : "Sign in — Humanfator";
    return () => {
      document.title = previous;
    };
  }, [mode, user, creating]);

  adoptRef.current = async () => {
    try {
      let token = await getAccessToken();
      if (!token) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        token = await getAccessToken();
      }
      if (!token) throw new Error("Google or Apple did not return a session.");
      const result = (await postJson("/api/auth/privy", { token })) as { user: User };
      setUser(result.user);
      await loadAgents();
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("error");
    if (code && OAUTH_ERRORS[code]) setError(OAUTH_ERRORS[code]);
    if (code) history.replaceState(null, "", location.pathname);
  }, []);

  useEffect(() => {
    if (!ready || leaving.current) return;
    const place = () => {
      if (leaving.current) return;
      const path = pagePath();
      if (user && (path === "/signin" || path === "/signup")) {
        history.replaceState(null, "", `${AGENT_PAGE}${location.search}`);
      } else if (!user && path === AGENT_PAGE) {
        history.replaceState(null, "", "/signin");
      }
    };
    place();
    window.addEventListener("popstate", place);
    return () => window.removeEventListener("popstate", place);
  }, [ready, user]);

  useEffect(() => {
    if (!privyReady) return;
    let live = true;
    (async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = (await response.json()) as { user: User | null };
        if (!live || leaving.current) return;
        if (data.user) {
          setUser(data.user);
          await loadAgents();
          return;
        }
        if (!authenticated) return;
        await adoptRef.current();
      } catch (err) {
        if (live) setError(err instanceof Error ? err.message : "The account server is not responding.");
      } finally {
        if (live) setReady(true);
      }
    })();
    return () => {
      live = false;
    };
  }, [privyReady, authenticated]);

  const choose = (next: Mode) => {
    setMode(next);
    setError("");
    history.replaceState(null, "", `${next === "signup" ? "/signup" : "/signin"}${location.search}`);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (mode === "signup" && (name.length < 2 || name.length > 40)) {
      setError("Use a name with 2–40 characters.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const usernameOk = mode === "signin" && /^[a-zA-Z0-9._-]{2,32}$/.test(email);
    if (!emailOk && !usernameOk) {
      setError(mode === "signin" ? "Enter the email or username on the account." : "Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const result = (await postJson(
        mode === "signup" ? "/api/auth/signup" : "/api/auth/signin",
        mode === "signup" ? { name, email, password } : { email, password },
      )) as { user: User };
      setUser(result.user);
      await loadAgents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The request failed.");
    } finally {
      setPending(false);
    }
  };

  const signOut = async () => {
    leaving.current = true;
    await postJson("/api/auth/signout", {}).catch(() => undefined);
    await logout().catch(() => undefined);
    setUser(null);
    setAgents([]);
    setAgentId(null);
    setCreating(false);
    setMessages([]);
    setChats([]);
    setChatId(null);
    setMode("signin");
    history.replaceState(null, "", "/signin");
    leaving.current = false;
  };

  const startProvider = (provider: "google" | "apple") => {
    setError("");
    setPending(true);
    void initOAuth({ provider }).catch((err) => {
      setPending(false);
      setError(privyError(err));
    });
  };

  const createAgent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (name.length < 2 || name.length > 40) {
      setError("Name the agent with 2–40 characters.");
      return;
    }
    if (kind !== "personal") {
      setError(`${KIND_LABEL[kind]} is coming soon.`);
      return;
    }
    if (agents.some((agent) => agent.kind === "personal")) {
      setError("You already have a Personal agent.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const result = (await postJson("/api/agents", { name, kind, plan: "free" })) as { agent: WorkAgent };
      setAgents((current) => [...current, result.agent]);
      setAgentId(result.agent.id);
      setMessages([]);
      setChats([]);
      setChatId(null);
      setCreating(false);
      history.replaceState(null, "", AGENT_PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The agent could not be created.");
    } finally {
      setPending(false);
    }
  };

  const selectAgent = async (id: string) => {
    const found = agents.find((item) => item.id === id);
    if (!found || found.id === agentId) return;
    setAgentId(found.id);
    setKind(found.kind);
    setCreating(false);
    setError("");
    setPending(true);
    try {
      await openThread(found.id);
    } finally {
      setPending(false);
    }
  };

  const sendTurn = async (turn: { message: string; brief?: string; media?: "image" | "video" }) => {
    if (!turn.message.trim() || !agentId) return false;
    setPending(true);
    setError("");
    try {
      const result = (await postJson("/api/agent", { ...turn, agentId, ...(chatId ? { chatId } : {}) })) as {
        messages: WorkMessage[];
        credits?: WorkAgent["credits"];
        chat?: WorkChat;
        chats?: WorkChat[];
      };
      setMessages(result.messages);
      setChats(result.chats ?? []);
      setChatId(result.chat?.id ?? chatId);
      setAgents((current) =>
        current.map((item) => (item.id === agentId ? { ...item, credits: result.credits ?? null } : item)),
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "The agent could not reply.");
      return false;
    } finally {
      setPending(false);
    }
  };

  const active = agents.find((item) => item.id === agentId) ?? null;
  const wanted = requestedKind();
  const agentName = wanted ? `${KIND_LABEL[wanted]} Agent` : "";
  const headline = user
    ? creating
      ? "CREATE\nAGENT."
      : active
        ? KIND_HEAD[active.kind]
        : "YOUR\nAGENT."
    : mode === "signup"
      ? "CREATE\nAGENT."
      : "SIGN\nIN.";
  const [first, second] = headline.split("\n");

  const workspace = Boolean(user && ready && !creating);

  return (
    <div className={`signin-page${workspace ? " is-workspace" : ""}`}>
      <header className="signin-bar">
        <a className="brand" href="/">
          <img className="brand-icon" src="/logo.png" alt="" />Humanfator
        </a>
        <a className="mono signin-session" href="/">
          Return home
        </a>
      </header>

      {workspace && user ? (
        <Workspace
          username={user.username}
          agents={agents}
          activeId={agentId}
          chats={chats}
          chatId={chatId}
          messages={messages}
          pending={pending}
          error={error}
          onSelect={(id) => void selectAgent(id)}
          canCreate={openKind(agents) !== null}
          onOpenChat={(id) => {
            if (!agentId || id === chatId) return;
            setError("");
            setChatId(id);
            setMessages([]);
            void openThread(agentId, id);
          }}
          onNewChat={() => {
            setChatId(null);
            setMessages([]);
            setError("");
          }}
          onCreate={() => {
            if (!openKind(agents)) return;
            setKind("personal");
            setCreating(true);
            setError("");
          }}
          onSignOut={() => void signOut()}
          onSend={sendTurn}
        />
      ) : (
      <main className="signin-main">
        <section className="signin-copy">
          <div className="signin-copy-block">
            <p className="mono signin-kicker">
              {user
                ? creating
                  ? "NAME YOUR AGENT"
                  : active
                    ? `${active.name.toUpperCase()}  /  ONLINE`
                    : "AGENT ONLINE"
                : agentName
                  ? `CREATE YOUR ${agentName.toUpperCase()}`
                  : mode === "signup"
                    ? "CREATE ACCOUNT"
                    : "AGENT ACCESS"}
            </p>
            <h1>
              {first}
              <br />
              {second?.replace(".", "")}
              <span>.</span>
            </h1>
            <p>
              {user
                ? creating
                  ? "Name the Personal agent. Free is available now. Code, Design, and Pro come later."
                  : active
                    ? KIND_COPY[active.kind]
                    : "Create an agent, then talk to it here."
                : agentName
                  ? `Create an account to start your ${agentName}. Sign in if you already have one.`
                  : mode === "signup"
                    ? "Create the account, then name a Personal agent on the next step."
                    : "Sign in to the Personal agent. Your chats stay on this account."}
            </p>
            {!user && (
              <ul className="signin-points">
                <li>
                  <span>01</span> One Personal agent, with chat history
                </li>
                <li>
                  <span>02</span> Email, Google, or Apple
                </li>
                <li>
                  <span>03</span> Code and Design are coming soon
                </li>
              </ul>
            )}
          </div>
        </section>

        <section className="signin-panel" aria-label={user ? "Your agent" : "Account"}>
          {!ready ? (
            <div className="signin-card">
              <p className="mono signin-kicker">CONNECTING</p>
            </div>
          ) : user && creating ? (
            <div className="signin-card">
              <p className="mono signin-kicker">PERSONAL IS OPEN</p>
              <form className="signin-form" onSubmit={createAgent}>
                <div className="agent-kinds" role="tablist" aria-label="Agent kind">
                  {KINDS.map((item) => {
                    const soon = item !== "personal";
                    const taken = item === "personal" && agents.some((agent) => agent.kind === "personal");
                    return (
                      <button
                        key={item}
                        type="button"
                        role="tab"
                        aria-selected={kind === item}
                        disabled={soon || taken}
                        onClick={() => setKind(item)}
                      >
                        {KIND_LABEL[item]}
                        {soon ? " · Soon" : taken ? " · Created" : ""}
                      </button>
                    );
                  })}
                </div>
                <div className="plan-choices" role="radiogroup" aria-label="Plan">
                  <button type="button" role="radio" aria-checked={true}>
                    <strong>FREE</strong>
                    On now.
                  </button>
                  <button type="button" role="radio" aria-checked={false} disabled>
                    <strong>PRO · {DAILY_CREDITS} CREDITS / DAY</strong>
                    Not available yet.
                  </button>
                </div>
                <label className="signin-field" htmlFor={nameId}>
                  Agent name
                  <input
                    id={nameId}
                    name="name"
                    autoComplete="off"
                    required
                    minLength={2}
                    maxLength={40}
                    placeholder={`${KIND_LABEL[kind]} Agent`}
                  />
                </label>
                {error && (
                  <p className="signin-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="signin-submit" type="submit" disabled={pending}>
                  {pending ? "PLEASE WAIT" : "CREATE AGENT"} <span>↗</span>
                </button>
              </form>
              <div className="signin-actions">
                {agents.length > 0 && (
                  <button
                    className="signin-text"
                    type="button"
                    onClick={() => {
                      setCreating(false);
                      if (agentId) void openThread(agentId);
                    }}
                  >
                    Back to your agent
                  </button>
                )}
                <a className="signin-text" href="/">
                  Return home
                </a>
                <button className="signin-text" type="button" onClick={signOut}>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="signin-card">
              <div className="auth-switch" role="tablist" aria-label="Account action">
                <button type="button" role="tab" aria-selected={mode === "signin"} onClick={() => choose("signin")}>
                  Sign in
                </button>
                <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => choose("signup")}>
                  Create account
                </button>
              </div>
              <p className="signin-card-note">
                {mode === "signup" ? "Name, email, and a password of at least 8 characters." : "Use the email or username on the account."}
              </p>
              <form className="signin-form" onSubmit={onSubmit} noValidate key={mode}>
                {mode === "signup" && (
                  <label className="signin-field" htmlFor={nameId}>
                    Name
                    <input id={nameId} name="name" autoComplete="name" required minLength={2} maxLength={40} placeholder="Your name" />
                  </label>
                )}
                <label className="signin-field" htmlFor={emailId}>
                  {mode === "signup" ? "Email" : "Email or username"}
                  <input
                    id={emailId}
                    name="email"
                    type="text"
                    inputMode={mode === "signup" ? "email" : "text"}
                    autoComplete={mode === "signup" ? "email" : "username"}
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    maxLength={120}
                    placeholder="you@example.com"
                  />
                </label>
                <label className="signin-field" htmlFor={passwordId}>
                  Password
                  <span className="signin-password">
                    <input
                      id={passwordId}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      required
                      minLength={8}
                      maxLength={128}
                      placeholder="at least 8 characters"
                    />
                    <button
                      className="signin-reveal"
                      type="button"
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((open) => !open)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </span>
                </label>
                {error && (
                  <p className="signin-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="signin-submit" type="submit" disabled={pending}>
                  {pending ? "PLEASE WAIT" : mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"} <span>↗</span>
                </button>
              </form>
              <div className="signin-or" role="separator">
                <span>or</span>
              </div>
              <div className="signin-providers">
                <button
                  className="signin-provider"
                  type="button"
                  disabled={!privyReady || pending || oauthState.status === "loading"}
                  onClick={() => startProvider("google")}
                >
                  <GoogleMark />
                  Continue with Google
                </button>
                <button
                  className="signin-provider"
                  type="button"
                  disabled={!privyReady || pending || oauthState.status === "loading"}
                  onClick={() => startProvider("apple")}
                >
                  <AppleMark />
                  Continue with Apple
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      )}
    </div>
  );
}
