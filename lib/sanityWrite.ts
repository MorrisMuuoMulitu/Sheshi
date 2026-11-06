/**
 * Write-side Sanity client (PLAN.md Phase 4).
 *
 * Token resolution order (never logged, never exposed to the client):
 *   1. `SANITY_API_WRITE_TOKEN` / `SANITY_API_TOKEN` env var (production — set on Vercel)
 *   2. Local Sanity CLI login (`~/.config/sanity/config.json` → `authToken`),
 *      development only — lets `npm run dev` submissions land without extra setup.
 *
 * `useCdn: false` — writes must hit the API directly.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient, type SanityClient } from "@sanity/client";
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "./sanity";

let cachedToken: string | null | undefined;

/** Resolve the write token once, lazily (fs access only in dev). */
function resolveToken(): string | null {
  if (cachedToken !== undefined) return cachedToken;

  const envToken =
    process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN || null;
  if (envToken) {
    cachedToken = envToken;
    return cachedToken;
  }

  // Local CLI session fallback — development only (Vercel has no homedir login).
  if (process.env.NODE_ENV !== "production") {
    try {
      const cfgFile = path.join(os.homedir(), ".config", "sanity", "config.json");
      const cfg = JSON.parse(fs.readFileSync(cfgFile, "utf8")) as Record<string, string>;
      if (cfg.authToken) {
        cachedToken = cfg.authToken;
        return cachedToken;
      }
    } catch {
      /* no local login — fall through */
    }
  }

  cachedToken = null;
  return null;
}

/** Whether a write token is available (routes return a clear 503 if not). */
export function hasWriteToken(): boolean {
  return resolveToken() !== null;
}

let client: SanityClient | null = null;

/** Write client (lazy — avoids fs work at module load during build). */
export function getWriteClient(): SanityClient {
  const token = resolveToken();
  if (!token) {
    throw new Error(
      "No Sanity write token. Set SANITY_API_WRITE_TOKEN (or run `npx sanity login` in dev).",
    );
  }
  if (!client) {
    client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: false,
      token,
    });
  }
  return client;
}
