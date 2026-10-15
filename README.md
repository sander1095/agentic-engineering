# agentic-engineering

Skills for coding agents. Installs as a plugin in Claude Code, GitHub Copilot CLI and OpenCode, and works in any other agent that reads [Agent Skills](https://agentskills.io).

## Skills

| Skill | What it does |
|---|---|
| [`tired-reviewer`](skills/tired-reviewer/SKILL.md) | Makes text concise and readable. A fresh, impatient reviewer critiques the draft, the agent fixes it, and they repeat until the reviewer is happy. |

Ask for it by name ("use tired-reviewer on this PR description"), or let the agent pick it when you ask it to shorten or tighten text.

## Install

**Claude Code**

```sh
claude plugin marketplace add sander1095/agentic-engineering
claude plugin install agentic-engineering@agentic-engineering
```

**GitHub Copilot CLI**

```sh
copilot plugin marketplace add sander1095/agentic-engineering
copilot plugin install agentic-engineering@agentic-engineering
```

**OpenCode**: add the plugin to `~/.config/opencode/opencode.json` (or a project's `opencode.json`) and restart OpenCode.

```json
{
  "plugins": ["agentic-engineering@git+https://github.com/sander1095/agentic-engineering.git"]
}
```

This is for OpenCode 2.x. OpenCode 1.x uses the `plugin` key instead of `plugins`.

**Any other agent**: copy `skills/tired-reviewer/` into the agent's skills folder, such as `~/.agents/skills/` or `~/.claude/skills/`.

## How it's packaged

| Path | Used by |
|---|---|
| `skills/` | Every harness: the skills themselves |
| `.claude-plugin/` | Claude Code and Copilot CLI: plugin and marketplace manifests |
| `package.json`, `index.js`, `.opencode/plugins/` | OpenCode: a small plugin that registers `skills/` |

## License

[MIT](LICENSE)
