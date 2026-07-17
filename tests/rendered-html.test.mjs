import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the CLS firefighter background investigations page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CLS Firefighter Background Investigations<\/title>/i);
  assert.match(html, /Firefighter Background Investigations for Confident Public-Safety Hiring/i);
  assert.match(html, /Built for/i);
  assert.match(html, /Fire chiefs, EMS hiring boards, and municipal leaders/i);
  assert.match(html, /fire departments move firefighter and EMS candidates/i);
  assert.match(html, /fire department background checks/i);
  assert.match(html, /Fire Department Background Check Process Built for Hiring Cycles/i);
  assert.match(html, /href="https:\/\/cls-ent\.com\/">Home<\/a>/i);
  assert.match(html, /Background Investigations/i);
  assert.match(html, /Firefighter Background Investigations<\/a>/i);
  assert.match(html, /href="\/police-background-investigations">Police/i);
  assert.match(html, /Call Us Today: 815-836-0236/i);
  assert.match(html, /Request a Background Check/i);
  assert.match(html, /Trusted by departments and agencies nationwide since 2000/i);
  assert.match(html, /CLS Background Investigations &amp; Services/i);
  assert.match(html, /Fire \/ EMS hiring support/i);
  assert.match(html, /Candidate files that keep the list moving/i);
  assert.match(html, /cls-firefighter-background-hero-custom\.png/i);
  assert.match(html, /Map the Hiring List/i);
  assert.match(html, /Work the Open Items/i);
  assert.match(html, /Firefighter \/ EMT candidate files/i);
  assert.match(html, /What CLS handles/i);
  assert.match(html, /What the department still controls/i);
  assert.match(html, /Review-ready candidate file/i);
  assert.match(html, /Fire-service leaders use CLS when candidate screening needs to be consistent/i);
  assert.match(html, /Fire district screening/i);
  assert.match(html, /Gina Degleffetti/i);
  assert.match(html, /Roberts Park Fire Protection District/i);
  assert.match(html, /Come prepared to talk through the real hiring cycle/i);
  assert.ok(
    html.indexOf("Come prepared to talk through the real hiring cycle") <
      html.indexOf("Firefighter Background Check Questions"),
  );
  assert.match(html, /CLS Client Login/i);
  assert.match(html, /Workplace Violence Mitigation/i);
  assert.match(html, /Site by/i);
  assert.match(html, /AV Social Strategies/i);
  assert.doesNotMatch(html, /Carol to confirm|\[Carol/i);
  assert.doesNotMatch(html, /Final review before launch|Only the details CLS must approve/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("server-renders the CLS police background investigations page", async () => {
  const response = await render("/police-background-investigations");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CLS Police Background Investigations<\/title>/i);
  assert.match(html, /Police Background Investigations for Confident Law-Enforcement Hiring/i);
  assert.match(html, /Police chiefs, command staff, and municipal hiring leaders/i);
  assert.match(html, /police departments move law-enforcement candidates/i);
  assert.match(html, /law-enforcement background checks/i);
  assert.match(html, /A Police Background Check Process Built for Hiring Cycles/i);
  assert.match(html, /href="https:\/\/cls-ent\.com\/">Home<\/a>/i);
  assert.match(html, /Background Investigations/i);
  assert.match(html, /href="\/">Firefighter Background Investigations/i);
  assert.match(html, /cls-police-background-hero\.png/i);
  assert.match(html, /Law-enforcement hiring support/i);
  assert.match(html, /Candidate files built for command review/i);
  assert.match(html, /Law-enforcement candidate files/i);
  assert.match(html, /What CLS handles/i);
  assert.match(html, /What the department still controls/i);
  assert.match(html, /Why departments use outside support/i);
  assert.match(html, /Police hiring leaders use CLS/i);
  assert.match(html, /Police Background Investigation Questions/i);
  assert.match(html, /Ready to strengthen your police hiring process/i);
  assert.doesNotMatch(html, /firefighter background check support/i);
  assert.doesNotMatch(html, /What fire departments say/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("keeps the page free of starter preview code", async () => {
  const [page, policePage, layout, packageJson, previewFiles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/police-background-investigations/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../app/_sites-preview", import.meta.url)),
  ]);

  assert.match(page, /cls-logo-stacked/);
  assert.match(page, /cls-firefighter-background-hero-custom/);
  assert.match(page, /Firefighter Background Check Questions/);
  assert.match(page, /firefighter\s+hiring process/);
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /cls-firefighter-module-overlay/);
  assert.match(css, /firefighter-background-investigations\.png/);
  assert.match(css, /comparison-table/);
  assert.match(css, /testimonial-card/);
  assert.match(css, /problem-section::before/);
  assert.match(css, /faq-section/);
  assert.match(css, /scope-connector/);
  assert.match(css, /service-logo-panel/);
  assert.match(css, /testimonial-intro/);
  assert.doesNotMatch(css, /audience-band/);
  assert.match(css, /nav-submenu/);
  assert.doesNotMatch(css, /service-switcher/);
  assert.match(css, /service-mini-grid/);
  assert.match(css, /comparison-cues/);
  assert.match(css, /cls-shield-check-white\.svg/);
  assert.match(css, /process-card::after/);
  assert.match(css, /deliverable-list article::before/);
  assert.match(css, /fire-page/);
  assert.match(css, /box-shadow: inset 5px 0 0 var\(--audience-accent\)/);
  assert.doesNotMatch(page, /<div className="service-logo-panel">\s*<img/i);
  assert.doesNotMatch(page, /className="audience-band"/);
  assert.doesNotMatch(page, /className="service-switcher"/);
  assert.match(page, /The department keeps the hiring authority/i);
  assert.match(policePage, /cls-police-background-hero/);
  assert.match(policePage, /police background investigations/i);
  assert.doesNotMatch(policePage, /className="audience-band"/);
  assert.doesNotMatch(policePage, /className="service-switcher"/);
  assert.match(css, /cls-police-module-overlay/);
  assert.match(css, /cls-police-deliverables-custom-bg\.png/);
  assert.match(css, /cls-police-cta-custom-bg\.png/);
  assert.match(css, /police-page/);
  assert.match(css, /police-page \.deliverables-section/);
  const policeBackgroundUrls = [
    ...css.matchAll(/\.police-page [^{]+\{[^}]*?url\("([^"]+)"\)/gs),
  ].map((match) => match[1]);
  assert.equal(policeBackgroundUrls.length, new Set(policeBackgroundUrls).size);
  assert.match(css, /footer-credit/);
  assert.match(layout, /openGraph/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(policePage, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|next\/font\/google|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.deepEqual(previewFiles, []);
});
