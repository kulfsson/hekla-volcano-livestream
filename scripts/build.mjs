import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function replaceText(html, key, value) {
  const expression = new RegExp(`(<([a-z][a-z0-9-]*)[^>]*\\sdata-cms="${escapeRegExp(key)}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`, "i");
  if (!expression.test(html)) throw new Error(`Missing CMS field marker: ${key}`);
  return html.replace(expression, (_match, opening, _tag, closing) => `${opening}${escapeHtml(value)}${closing}`);
}

function replaceBlock(html, name, body) {
  const start = `<!-- cms:${name}:start -->`;
  const end = `<!-- cms:${name}:end -->`;
  const expression = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  if (!expression.test(html)) throw new Error(`Missing CMS block marker: ${name}`);
  return html.replace(expression, () => `${start}\n${body}\n          ${end}`);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(projectRoot, relativePath), "utf8"));
}

async function buildHome() {
  const filename = path.join(projectRoot, "dist", "index.html");
  const content = await readJson("content/home.json");
  let html = await readFile(filename, "utf8");

  const fields = {
    "hero.eyebrow": content.hero.eyebrow,
    "hero.title": content.hero.title,
    "hero.intro": content.hero.intro,
    "camera.heading": content.camera.heading,
    "camera.title": content.camera.title,
    "camera.description": content.camera.description,
    "history.heading": content.history.heading,
    "history.intro": content.history.intro,
    field_notes_heading: content.field_notes_heading,
    official_heading: content.official_heading,
    footer_text: content.footer_text
  };
  for (const [key, value] of Object.entries(fields)) html = replaceText(html, key, value);

  const facts = content.facts.map((fact) =>
    `        <div><span class="fact-value">${escapeHtml(fact.value)}</span><span class="fact-label">${escapeHtml(fact.label)}</span></div>`
  ).join("\n");
  html = replaceBlock(html, "facts", facts);

  const eras = content.eras.map((era) =>
    `          <article><span>${escapeHtml(era.period)}</span><h3>${escapeHtml(era.title)}</h3><p>${escapeHtml(era.description)}</p></article>`
  ).join("\n");
  html = replaceBlock(html, "eras", eras);

  const notes = content.field_notes.map((note) =>
    `          <article><span>${escapeHtml(note.number)}</span><h3>${escapeHtml(note.title)}</h3><p>${escapeHtml(note.description)}</p></article>`
  ).join("\n");
  html = replaceBlock(html, "field-notes", notes);

  await writeFile(filename, html, "utf8");
}

async function buildHistory() {
  const filename = path.join(projectRoot, "dist", "history.html");
  const content = await readJson("content/history.json");
  let html = await readFile(filename, "utf8");

  const fields = {
    "hero.eyebrow": content.hero.eyebrow,
    "hero.title": content.hero.title,
    "hero.intro": content.hero.intro,
    "prehistory.heading": content.prehistory.heading,
    "prehistory.paragraph_one": content.prehistory.paragraph_one,
    "prehistory.paragraph_two": content.prehistory.paragraph_two,
    "chronology.heading": content.chronology.heading,
    "chronology.intro": content.chronology.intro,
    "count_note.heading": content.count_note.heading,
    "count_note.paragraph_one": content.count_note.paragraph_one,
    "count_note.paragraph_two": content.count_note.paragraph_two,
    "monitoring.heading": content.monitoring.heading,
    "monitoring.body": content.monitoring.body,
    footer_text: content.footer_text
  };
  for (const [key, value] of Object.entries(fields)) html = replaceText(html, key, value);

  const events = content.events.map((event) =>
    `          <li><time>${escapeHtml(event.date)}</time><div class="event"><span class="vei">${escapeHtml(event.vei)}</span><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.description)}</p></div></li>`
  ).join("\n");
  html = replaceBlock(html, "events", events);

  await writeFile(filename, html, "utf8");
}

await Promise.all([buildHome(), buildHistory()]);
console.log("Built homepage and history page from editable content.");
