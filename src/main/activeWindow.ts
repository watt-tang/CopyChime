import { ActiveWindowInfo } from "../shared/types";

export async function getActiveWindow(): Promise<ActiveWindowInfo | null> {
  if (process.platform !== "win32") return null;

  try {
    const { execFile } = require("child_process") as typeof import("child_process");

    const script = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Text;
public class Win32 {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll", SetLastError=true)] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
  [DllImport("user32.dll", CharSet=CharSet.Auto)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
  [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr hWnd);
}
"@
$hwnd = [Win32]::GetForegroundWindow()
$pid = 0
[Win32]::GetWindowThreadProcessId($hwnd, [ref]$pid) | Out-Null
$len = [Win32]::GetWindowTextLength($hwnd)
$sb = New-Object System.Text.StringBuilder ($len + 1)
[Win32]::GetWindowText($hwnd, $sb, $sb.Capacity) | Out-Null
$proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
$name = if ($proc) { $proc.ProcessName } else { "" }
$title = $sb.ToString()
Write-Output "$name|$title"
`;

    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), 1500);
      execFile("powershell", ["-NoProfile", "-Command", script], { timeout: 2000 }, (err: Error | null, stdout: string) => {
        clearTimeout(timer);
        if (err || !stdout) {
          resolve(null);
          return;
        }
        const parts = stdout.trim().split("|");
        const processName = parts[0] || "";
        const title = parts.slice(1).join("|") || "";
        if (!processName) {
          resolve(null);
          return;
        }
        resolve({ processName, title });
      });
    });
  } catch {
    return null;
  }
}
