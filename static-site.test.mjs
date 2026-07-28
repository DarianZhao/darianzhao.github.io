import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("./", import.meta.url);

test("publishes the learning journal homepage", async () => {
  const [html, notes] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("notes-data.js", root), "utf8"),
  ]);
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<h1 id="page-title"[^>]*>/);
  assert.match(html, /终身学习者/);
  assert.match(html, /易学研习者/);
  assert.match(html, /一个持续生长的个人坐标系/);
  for (const id of ["profile", "studies", "notes", "questions", "now"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/notes-data\.js" defer/);
  assert.match(html, /src="\.\/script\.js" defer/);
  assert.match(notes, /2026-07-28/);
});

test("uses www.darianzhao.com as the only public identity", async () => {
  const [html, cname, robots, sitemap] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("CNAME", root), "utf8"),
    readFile(new URL("robots.txt", root), "utf8"),
    readFile(new URL("sitemap.xml", root), "utf8"),
  ]);
  assert.equal(cname.trim(), "www.darianzhao.com");
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.darianzhao\.com\/"/);
  assert.match(robots, /https:\/\/www\.darianzhao\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/www\.darianzhao\.com\/<\/loc>/);
  assert.doesNotMatch(`${html}\n${robots}\n${sitemap}`, /chatgpt\.site|pages\.dev|vercel\.app/);
});

test("remains a framework-free GitHub Pages site", async () => {
  const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.deepEqual(Object.keys(packageJson.scripts), ["test"]);
  assert.equal(packageJson.dependencies, undefined);
  assert.equal(packageJson.devDependencies, undefined);
  await access(new URL(".nojekyll", root));
  await assert.rejects(access(new URL(".openai/hosting.json", root)));
});
