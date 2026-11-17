/**
 * Tiny JSON-file store for orders and contact messages.
 *
 * - Data lives in DATA_DIR (env) or ./.data — outside git, survives redeploys.
 * - Writes are serialised in-process and written atomically (tmp + rename),
 *   which is safe for a single `next start` process (PM2 fork mode).
 *
 * SERVER ONLY — never import from a client component.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

export const DATA_DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), ".data");

let chain: Promise<unknown> = Promise.resolve();

/** Run `fn` after every previously queued store operation has finished. */
function serialise<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => undefined);
  return run;
}

async function readFileJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(/*turbopackIgnore: true*/ DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeFileJson(file: string, data: unknown) {
  await fs.mkdir(/*turbopackIgnore: true*/ DATA_DIR, { recursive: true });
  const target = path.join(/*turbopackIgnore: true*/ DATA_DIR, file);
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target);
}

/** Read a collection (array) file. */
export function readCollection<T>(file: string): Promise<T[]> {
  return serialise(() => readFileJson<T[]>(file, []));
}

/** Read-modify-write a collection atomically. `mutate` returns the new array and a result. */
export function updateCollection<T, R>(file: string, mutate: (items: T[]) => { items: T[]; result: R }): Promise<R> {
  return serialise(async () => {
    const items = await readFileJson<T[]>(file, []);
    const { items: next, result } = mutate(items);
    await writeFileJson(file, next);
    return result;
  });
}

/* ------------------------------------------------------------------------
   Single-document files (an object rather than an array), e.g. the catalogue.
   `fallback` supplies the document when the file does not exist yet.
------------------------------------------------------------------------- */

/** Read a document file, or the fallback when it has never been written. */
export function readDocument<T>(file: string, fallback: () => T): Promise<T> {
  return serialise(async () => {
    const doc = await readFileJson<T | null>(file, null);
    return doc ?? fallback();
  });
}

/** Read-modify-write a document atomically. */
export function updateDocument<T, R>(
  file: string,
  fallback: () => T,
  mutate: (doc: T) => { doc: T; result: R },
): Promise<R> {
  return serialise(async () => {
    const current = (await readFileJson<T | null>(file, null)) ?? fallback();
    const { doc, result } = mutate(current);
    await writeFileJson(file, doc);
    return result;
  });
}
