"""
Smoke-test OpenAI API. Set key in environment only:

  Windows PowerShell:
    $env:OPENAI_API_KEY = "sk-...your-new-key..."
    python test_openai_api.py

  Linux/macOS:
    export OPENAI_API_KEY="sk-...your-new-key..."
    python test_openai_api.py
"""

import os
import sys
import json
import urllib.request
import urllib.error


def main() -> int:
    api_key = (os.environ.get("OPENAI_API_KEY") or "").strip()
    if not api_key:
        print("ERROR: Set environment variable OPENAI_API_KEY.", file=sys.stderr)
        return 1

    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "Reply with exactly: OK"}],
        "max_tokens": 16,
    }
    data = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print(f"HTTP {e.code}: {err}", file=sys.stderr)
        return 1
    except urllib.error.URLError as e:
        print(f"Network error: {e}", file=sys.stderr)
        return 1

    try:
        text = body["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        print("Unexpected response:", json.dumps(body, indent=2)[:2000])
        return 1

    print("API OK. Assistant reply:", repr(text.strip()))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())