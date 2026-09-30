import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("./", import.meta.url);

test("homepage links resolve to real sections and local files", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, "duplicate element IDs");
  assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (href.startsWith("#")) assert.ok(ids.includes(href.slice(1)), `missing anchor ${href}`);
    if (href.startsWith("./")) await access(new URL(href.split("?")[0], root));
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/)[1]);
  assert.equal(schema.url, "https://www.darianzhao.com/");
  assert.equal(schema.email, "hi@darianzhao.com");
});

test("every application and material can form a useful inquiry", async () => {
  const context = {window:{}};
  vm.runInNewContext(await readFile(new URL("materials-data.js", root), "utf8"), context);
  const data = context.window.TRF;
  assert.equal(data.materials.length, 4);
  assert.equal(new Set(data.materials.map(item => item.id)).size, 4);
  for (const item of [...data.materials, ...Object.values(data.applications)]) {
    assert.ok(item.description.length > 50);
    assert.ok(item.questions.length >= 3);
  }
  for (const video of Object.values(data.videos)) {
    await access(new URL(video.src, root));
    await access(new URL(video.poster, root));
    assert.ok(video.transcript.length > 50);
  }
  const html = await readFile(new URL("index.html", root), "utf8");
  for (const [, key] of html.matchAll(/data-application="([^"]+)"/g)) assert.ok(data.applications[key]);
  for (const [, key] of html.matchAll(/data-video="([^"]+)"/g)) assert.ok(data.videos[key]);
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

test("remains a framework-free static site", async () => {
  const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.deepEqual(Object.keys(packageJson.scripts), ["test"]);
  assert.equal(packageJson.dependencies, undefined);
  assert.equal(packageJson.devDependencies, undefined);
  await access(new URL(".nojekyll", root));
  await assert.rejects(access(new URL(".openai/hosting.json", root)));
});

test("uses confirmed contacts, early videos and display-only supplied photos", async () => {
  const [html, script, data, brief] = await Promise.all(["index.html", "script.js", "materials-data.js", "assets/material-project-brief.txt"].map(file => readFile(new URL(file, root), "utf8")));
  assert.match(html, /href="mailto:hi@darianzhao\.com"/);
  assert.match(html, /href="mailto:darian@darianzhao\.com"/);
  assert.match(html, /id="wechat-id" value="15610170228" readonly/);
  assert.match(script, /#copy-wechat/);
  assert.match(script, /field\.focus\(\);field\.select\(\)/);
  assert.match(data, /email: 'hi@darianzhao\.com'/);
  assert.match(brief, /hi@darianzhao\.com \| darian@darianzhao\.com \| WeChat: 15610170228/);
  assert.doesNotMatch([html, script, data, brief].join("\n"), /sd\.terrific@gmail\.com|15905315816|159 0531 5816|tel:|\bTPR\b/);
  assert.deepEqual([...html.matchAll(/<section[^>]* id="([^"]+)"/g)].map(match => match[1]), ["top", "applications", "insights", "company", "finder", "materials", "approach", "resources", "inquiry"]);
  assert.doesNotMatch(html + script, /data-factory|factoryPhotos|photo-expand|factory-office-natural|research-at-work/);
  for (const asset of ["factory-office-v3.webp", "factory-campus-v3.webp", "research-workspace.webp", "research-team.webp"]) {
    assert.ok(html.includes(asset));
    await access(new URL("assets/" + asset, root));
  }
});

test("distinguishes laboratory trial equipment from full-scale manufacturing", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const figure = html.match(/<figure><div class="facility-photo"><img src="\.\/assets\/research-workspace\.webp"[\s\S]*?<\/figure>/)?.[0];
  assert.ok(figure);
  assert.match(figure, /LABORATORY TRIAL LINES/);
  assert.match(figure, /small-batch trials/);
  assert.match(figure, /not our full-scale manufacturing lines/);
  assert.doesNotMatch(figure, /3,000|20,000|50,000/);
});

test("presents the supplied company overview and all six application sectors", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const dataSource = await readFile(new URL("materials-data.js", root), "utf8");
  const context = {window:{}};
  vm.runInNewContext(dataSource, context);
  assert.equal(Object.keys(context.window.TRF.applications).length, 6);
  for (const value of ["50,000+", "metric tonnes", "10+", "lines", "3,000", "20,000"]) assert.ok(html.includes(value));
  assert.match(html, /Annual capacity is not actual yearly output/);
  for (const name of ["青岛科技大学", "中国石油大学", "北京航空航天大学", "中科院化学研究中心"]) assert.ok(html.includes(name));
  assert.match(html, /joint postgraduate training base/);
  assert.match(html, /data-application="pharmaceutical"/);
  assert.match(html, /value="pharmaceutical"/);
  assert.match(html, /<option>Pharmaceutical packaging — contact components<\/option>/);
  assert.doesNotMatch(html + dataSource, /国产替代|import substitution|domestic substitution/i);
});

test("retires the legacy system without publishing its code or data", async () => {
  const html = await readFile(new URL("continuous-improvement/index.html", root), "utf8");
  const sitemap = await readFile(new URL("sitemap.xml", root), "utf8");
  assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(html, /http-equiv="refresh" content="0;url=https:\/\/www\.darianzhao\.com\/"/);
  assert.doesNotMatch(html, /<script|localStorage|process-data|app\.js|app\.css/);
  assert.doesNotMatch(sitemap, /continuous-improvement/);
  for (const file of ["app.js", "app.css", "process-data.js"]) {
    await assert.rejects(access(new URL("continuous-improvement/" + file, root)));
  }
});
