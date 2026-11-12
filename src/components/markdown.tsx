import type { ReactNode } from "react";

export function Markdown({ text }: { text: string }) {
  return <div className="talk-doc">{blocks(text.replace(/\r\n/g, "\n"))}</div>;
}

function blocks(text: string) {
  const lines = text.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(
        <pre key={key}>
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      key += 1;
      continue;
    }
    if (isTable(lines, i)) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        if (!isRule(lines[i])) rows.push(splitRow(lines[i]));
        i += 1;
      }
      const [head, ...body] = rows;
      out.push(
        <table key={key}>
          {head && (
            <thead>
              <tr>
                {head.map((cell, index) => (
                  <th key={index}>{inline(cell, `h${key}-${index}`)}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, index) => (
                  <td key={index}>{inline(cell, `c${key}-${rowIndex}-${index}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      key += 1;
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const Tag = heading[1].length === 1 ? "h2" : heading[1].length === 2 ? "h3" : "h4";
      out.push(<Tag key={key}>{inline(heading[2], `d${key}`)}</Tag>);
      key += 1;
      i += 1;
      continue;
    }
    if (isItem(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: ReactNode[] = [];
      while (i < lines.length && isItem(lines[i])) {
        items.push(<li key={items.length}>{inline(lines[i].replace(/^(\s*[-*]|\s*\d+\.)\s+/, ""), `i${key}-${items.length}`)}</li>);
        i += 1;
      }
      const Tag = ordered ? "ol" : "ul";
      out.push(<Tag key={key}>{items}</Tag>);
      key += 1;
      continue;
    }
    const para = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines, i)) {
      para.push(lines[i]);
      i += 1;
    }
    out.push(<p key={key}>{inline(para.join(" "), `p${key}`)}</p>);
    key += 1;
  }
  return out;
}

function startsBlock(lines: string[], index: number) {
  const line = lines[index];
  return line.trim().startsWith("```") || isTable(lines, index) || /^(#{1,3})\s+/.test(line) || isItem(line);
}

function isItem(line: string) {
  return /^(\s*[-*]|\s*\d+\.)\s+/.test(line);
}

function isTable(lines: string[], index: number) {
  return lines[index]?.includes("|") && isRule(lines[index + 1] ?? "");
}

function isRule(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function splitRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function inline(text: string, keyBase: string) {
  const nodes: ReactNode[] = [];
  const re = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[[^\]]+\]\((https?:\/\/[^\s)]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let count = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyBase}-${count}`;
    count += 1;
    if (token.startsWith("`")) nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    else if (token.startsWith("**")) nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("*")) nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    else {
      const link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(token);
      if (link) {
        nodes.push(
          <a key={key} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]}
          </a>,
        );
      }
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
