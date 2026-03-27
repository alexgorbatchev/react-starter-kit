import { describe, expect, test } from "bun:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const PLUGIN_FILE_PATH = path.resolve(
  import.meta.dir,
  "..",
  "componentRootTestIdPlugin.js",
);

describe("componentRootTestIdPlugin", () => {
  test("accepts matching root test ids and child test ids for JSX components", () => {
    const result = runOxlint(`
      export function Valid({ isOpen }: { isOpen: boolean }) {
        if (!isOpen) {
          return null;
        }

        return (
          <section data-testid='Valid'>
            <div data-testid='Valid--body'>Ready</div>
          </section>
        );
      }
    `);

    expect(result.exitCode).toBe(0);
    expect(result.messages).toEqual([]);
  });

  test("accepts createElement roots and child test ids in .ts components", () => {
    const result = runOxlint(
      `
      import { createElement } from 'react';

      export function QuickAskUserToolUI() {
        return createElement(
          'div',
          { 'data-testid': 'QuickAskUserToolUI' },
          createElement('span', { 'data-testid': 'QuickAskUserToolUI--summary' }, 'Ready'),
        );
      }
    `,
      "fixture.ts",
    );

    expect(result.exitCode).toBe(0);
    expect(result.messages).toEqual([]);
  });

  test("accepts forwardRef wrappers and root testId props on custom wrapper components", () => {
    const result = runOxlint(`
      export const TextInput = forwardRef(function TextInput(props, ref) {
        return <input ref={ref} data-testid='TextInput' {...props} />;
      });

      export function Wrapped() {
        return <ToolCallCard testId='Wrapped' title='ok' />;
      }

      export function Base({ testId }: { testId?: string }) {
        return <div data-testid={testId ?? 'Base'} />;
      }
    `);

    expect(result.exitCode).toBe(0);
    expect(result.messages).toEqual([]);
  });

  test("reports root and child test ids that do not match the component naming contract", () => {
    const result = runOxlint(`
      export function Broken() {
        return (
          <div data-testid='Broken--root'>
            <button data-testid='Wrong--action'>Action</button>
          </div>
        );
      }
    `);

    expect(result.exitCode).toBe(1);
    expect(result.messages).toEqual([
      {
        code: "react-starter-kit-testid(require-component-root-testid)",
        message:
          'Exported component "Broken" must render a root data-testid or testId exactly equal to "Broken".',
      },
      {
        code: "react-starter-kit-testid(require-component-root-testid)",
        message:
          'Component "Broken" must use child test ids in the format "Broken--thing". Received "Wrong--action".',
      },
    ]);
  });

  test("reports local helper components whose root test id is not the plain component name", () => {
    const result = runOxlint(`
      function ReasoningPart() {
        return <ToolCallCard testId='ReasoningPart--card' title='thinking' />;
      }

      export function AssistantMessage() {
        return <div data-testid='AssistantMessage'><ReasoningPart /></div>;
      }
    `);

    expect(result.exitCode).toBe(1);
    expect(result.messages).toEqual([
      {
        code: "react-starter-kit-testid(require-component-root-testid)",
        message:
          'Component "ReasoningPart" must use the plain root test id "ReasoningPart" on its root element. Received "ReasoningPart--card".',
      },
    ]);
  });

  test("reports fragment roots with exact diagnostics", () => {
    const result = runOxlint(`
      export function Fragmented() {
        return <>Missing root</>;
      }
    `);

    expect(result.exitCode).toBe(1);
    expect(result.messages).toEqual([
      {
        code: "react-starter-kit-testid(require-component-root-testid)",
        message:
          'Exported component "Fragmented" returns a fragment root; wrap it in a DOM element with data-testid="Fragmented".',
      },
    ]);
  });
});

interface OxlintResult {
  exitCode: number;
  messages: Array<{
    code: string;
    message: string;
  }>;
}

function runOxlint(
  fileContents: string,
  fileName = "fixture.tsx",
): OxlintResult {
  const tempDir = mkdtempSync(
    path.join(tmpdir(), "react-starter-kit-oxlint-testid-"),
  );

  try {
    const fixtureFilePath = path.join(tempDir, fileName);
    const configFilePath = path.join(tempDir, ".oxlintrc.json");

    writeFileSync(fixtureFilePath, fileContents.trimStart());
    writeFileSync(
      configFilePath,
      JSON.stringify({
        jsPlugins: [PLUGIN_FILE_PATH],
        rules: {
          "react-starter-kit-testid/require-component-root-testid": "error",
        },
      }),
    );

    const spawnResult = Bun.spawnSync({
      cmd: [
        process.execPath,
        "x",
        "oxlint",
        "-c",
        configFilePath,
        "-f",
        "json",
        fixtureFilePath,
      ],
      cwd: path.resolve(import.meta.dir, "..", "..", ".."),
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = new TextDecoder().decode(spawnResult.stdout);
    const stderr = new TextDecoder().decode(spawnResult.stderr);

    assert.equal(stderr, "");

    const payload = JSON.parse(stdout) as {
      diagnostics?: Array<{
        code?: string;
        message?: string;
      }>;
    };

    return {
      exitCode: spawnResult.exitCode,
      messages: (payload.diagnostics ?? []).map((diagnostic) => ({
        code: diagnostic.code ?? "",
        message: diagnostic.message ?? "",
      })),
    };
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}
