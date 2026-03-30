import path from "path";
import test from "node:test";
import assert from "node:assert/strict";

import { resolveProjectFilePath } from "@/lib/content/legacy-source";

test("resolveProjectFilePath maps root-level legacy pages to the workspace root", () => {
  assert.equal(resolveProjectFilePath("index.html"), path.join(process.cwd(), "index.html"));
  assert.equal(resolveProjectFilePath("about.html"), path.join(process.cwd(), "about.html"));
});

test("resolveProjectFilePath scopes service pages to the services directory", () => {
  assert.equal(
    resolveProjectFilePath("services/server-installation.html"),
    path.join(process.cwd(), "services", "server-installation.html")
  );
});

test("resolveProjectFilePath scopes site config reads to the data directory", () => {
  assert.equal(
    resolveProjectFilePath("data/site-config.json"),
    path.join(process.cwd(), "data", "site-config.json")
  );
});

test("resolveProjectFilePath rejects unsupported paths", () => {
  assert.throws(() => resolveProjectFilePath("../secrets.txt"), /Unsupported legacy content file/);
  assert.throws(() => resolveProjectFilePath("app/layout.tsx"), /Unsupported legacy content file/);
});
