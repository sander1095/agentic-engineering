// OpenCode plugin that registers every skills/<name>/SKILL.md in this repository.
// OpenCode V2 calls the default export's setup(); OpenCode V1 uses the named export's config hook.
// No dependencies, so OpenCode can install the repository straight from git.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../skills");

// Reads top-level `key: value` frontmatter lines. Enough for single-line name and description.
const parseSkill = (file) => {
  const match = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return undefined;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) fields[field[1]] = field[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return { fields, content: match[2] };
};

const readSkills = () => {
  if (!fs.existsSync(skillsDir)) return [];
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const file = path.join(skillsDir, entry.name, "SKILL.md");
      const skill = fs.existsSync(file) ? parseSkill(file) : undefined;
      if (!skill?.fields.description) return [];
      return [{
        id: entry.name,
        name: skill.fields.name || entry.name,
        description: skill.fields.description,
        path: file,
        content: skill.content,
      }];
    });
};

// OpenCode V2
const setup = async (ctx) => {
  if (typeof ctx?.skill?.transform !== "function") return;
  const skills = readSkills();
  await ctx.skill.transform((editor) => {
    for (const skill of skills) {
      // A throw inside a transform disables the whole plugin, so skip bad skills instead.
      try {
        editor.add(skill);
      } catch (error) {
        console.error(`[agentic-engineering] skipped skill "${skill.id}":`, error);
      }
    }
  });
};

// OpenCode V1
export const AgenticEngineeringPlugin = async () => ({
  config: async (config) => {
    if (Array.isArray(config.skills)) return;
    config.skills ??= {};
    config.skills.paths ??= [];
    if (!config.skills.paths.includes(skillsDir)) config.skills.paths.push(skillsDir);
  },
});

export default { id: "agentic-engineering", server: AgenticEngineeringPlugin, setup };
