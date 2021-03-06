// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertThrows, assertThrowsAsync } from "../testing/asserts.ts";
import * as path from "../path/mod.ts";
import { ensureFile, ensureFileSync } from "./ensure_file.ts";

const testdataDir = path.resolve("fs", "testdata");

Deno.test(async function ensureFileIfItNotExist(): Promise<void> {
  const testDir = path.join(testdataDir, "ensure_file_1");
  const testFile = path.join(testDir, "test.txt");

  await ensureFile(testFile);

  await assertThrowsAsync(
    async (): Promise<void> => {
      await Deno.stat(testFile).then((): void => {
        throw new Error("test file should exists.");
      });
    }
  );

  await Deno.remove(testDir, { recursive: true });
});

Deno.test(function ensureFileSyncIfItNotExist(): void {
  const testDir = path.join(testdataDir, "ensure_file_2");
  const testFile = path.join(testDir, "test.txt");

  ensureFileSync(testFile);

  assertThrows((): void => {
    Deno.statSync(testFile);
    throw new Error("test file should exists.");
  });

  Deno.removeSync(testDir, { recursive: true });
});

Deno.test(async function ensureFileIfItExist(): Promise<void> {
  const testDir = path.join(testdataDir, "ensure_file_3");
  const testFile = path.join(testDir, "test.txt");

  await Deno.mkdir(testDir, { recursive: true });
  await Deno.writeFile(testFile, new Uint8Array());

  await ensureFile(testFile);

  await assertThrowsAsync(
    async (): Promise<void> => {
      await Deno.stat(testFile).then((): void => {
        throw new Error("test file should exists.");
      });
    }
  );

  await Deno.remove(testDir, { recursive: true });
});

Deno.test(function ensureFileSyncIfItExist(): void {
  const testDir = path.join(testdataDir, "ensure_file_4");
  const testFile = path.join(testDir, "test.txt");

  Deno.mkdirSync(testDir, { recursive: true });
  Deno.writeFileSync(testFile, new Uint8Array());

  ensureFileSync(testFile);

  assertThrows((): void => {
    Deno.statSync(testFile);
    throw new Error("test file should exists.");
  });

  Deno.removeSync(testDir, { recursive: true });
});

Deno.test(async function ensureFileIfItExistAsDir(): Promise<void> {
  const testDir = path.join(testdataDir, "ensure_file_5");

  await Deno.mkdir(testDir, { recursive: true });

  await assertThrowsAsync(
    async (): Promise<void> => {
      await ensureFile(testDir);
    },
    Error,
    `Ensure path exists, expected 'file', got 'dir'`
  );

  await Deno.remove(testDir, { recursive: true });
});

Deno.test(function ensureFileSyncIfItExistAsDir(): void {
  const testDir = path.join(testdataDir, "ensure_file_6");

  Deno.mkdirSync(testDir, { recursive: true });

  assertThrows(
    (): void => {
      ensureFileSync(testDir);
    },
    Error,
    `Ensure path exists, expected 'file', got 'dir'`
  );

  Deno.removeSync(testDir, { recursive: true });
});
