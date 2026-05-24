const ZERO_WIDTH_RE = /[​‌‍﻿]/g;

export function toPlainText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(ZERO_WIDTH_RE, "")
    .replace(/[ \t]+$/gm, "");
}
