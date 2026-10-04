export interface ScannedSidebarItem {
  itemId: string;
  title: string;
  icon: string;
}

const CALL_PATTERN = /addSidebarItem\s*\(/g;

/**
 * Extracts every `addSidebarItem({ id, title, icon, ... })` call from plugin source text.
 * `constantsText` is searched for `const NAME = "value"` when a property is an identifier;
 * pass the plugin's other files too when constants are imported.
 */
export function scanSidebarItems(text: string, constantsText = text): ScannedSidebarItem[] {
  const items: ScannedSidebarItem[] = [];
  for (const match of text.matchAll(CALL_PATTERN)) {
    const openParen = match.index + match[0].length - 1;
    const args = extractBalancedParens(text, openParen);
    if (args === null) continue;
    const itemId = extractStringProperty(args, "id", constantsText);
    const title = extractStringProperty(args, "title", constantsText);
    if (itemId === null || title === null) continue;
    const icon = extractStringProperty(args, "icon", constantsText) ?? "";
    items.push({ itemId, title, icon });
  }
  return items;
}

/** Returns the text between the paren at `openParenIndex` and its matching close paren, skipping string contents. */
function extractBalancedParens(text: string, openParenIndex: number): string | null {
  let depth = 0;
  let quote: string | null = null;
  for (let i = openParenIndex; i < text.length; i += 1) {
    const ch = text[i];
    if (quote !== null) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "(") depth += 1;
    else if (ch === ")") {
      depth -= 1;
      if (depth === 0) return text.slice(openParenIndex + 1, i);
    }
  }
  return null;
}

/**
 * Pulls a top-level `key: "value"` string property from a JS object literal, tolerating any quote
 * style. A `key: SOME_CONST` value resolves through a `const SOME_CONST = "value"` in `fileText`.
 */
function extractStringProperty(source: string, key: string, fileText: string): string | null {
  const pattern = new RegExp(`(?:^|[^\\w$])${key}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`);
  const match = pattern.exec(source);
  if (match) return match[2];
  const identifier = new RegExp(`(?:^|[^\\w$])${key}\\s*:\\s*([A-Za-z_$][\\w$]*)\\s*[,}]`).exec(
    source,
  );
  if (!identifier) return null;
  const constant = new RegExp(
    `\\bconst\\s+${identifier[1].replaceAll("$", "\\$")}\\s*(?::\\s*string\\s*)?=\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`,
  ).exec(fileText);
  return constant ? constant[2] : null;
}
