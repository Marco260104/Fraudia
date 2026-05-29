from __future__ import annotations

import json

from ..training import train_pipeline


def main() -> None:
    result = train_pipeline()
    summary = result["summary"]
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

