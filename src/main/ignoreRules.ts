type CompiledRule =
  | { kind: "regex"; pattern: RegExp }
  | { kind: "string"; value: string };

export function compileIgnoreRules(input: string): CompiledRule[] {
  const rules: CompiledRule[] = [];
  const lines = input.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const regexMatch = trimmed.match(/^\/(.+)\/([gimsuy]*)$/);
    if (regexMatch) {
      try {
        rules.push({ kind: "regex", pattern: new RegExp(regexMatch[1], regexMatch[2]) });
      } catch {
        rules.push({ kind: "string", value: trimmed.toLowerCase() });
      }
    } else {
      rules.push({ kind: "string", value: trimmed.toLowerCase() });
    }
  }
  return rules;
}

export function matchesIgnoreRules(text: string, input: string): boolean {
  const rules = compileIgnoreRules(input);
  const lowerText = text.toLowerCase();
  return rules.some((rule) => {
    if (rule.kind === "regex") return rule.pattern.test(text);
    return lowerText.includes(rule.value);
  });
}
