import type { PostgrestError } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { QueryError, throwQueryError } from "./errors";

function pgError(overrides: Partial<PostgrestError> = {}): PostgrestError {
  return {
    message: "boom",
    code: "00000",
    details: null,
    hint: null,
    name: "PostgrestError",
    ...overrides,
  } as PostgrestError;
}

describe("QueryError", () => {
  it("is a real Error with a stable `name`", () => {
    const err = new QueryError("loading tasks", pgError());
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("QueryError");
  });

  it("prefixes the message with the calling context", () => {
    const err = new QueryError("loading tasks", pgError({ message: "boom" }));
    expect(err.message).toBe("loading tasks: boom");
  });

  it("appends the PostgREST hint with an em-dash separator", () => {
    const err = new QueryError("ctx", pgError({ message: "msg", hint: "try this" }));
    expect(err.message).toBe("ctx: msg — try this");
  });

  it("appends the missing-migration hint when code is 42P01 (undefined table)", () => {
    const err = new QueryError("ctx", pgError({ code: "42P01", message: "missing" }));
    expect(err.message).toContain("missing migration");
    expect(err.code).toBe("42P01");
  });

  it("appends the missing-migration hint when code is 42703 (undefined column)", () => {
    const err = new QueryError("ctx", pgError({ code: "42703", message: "missing" }));
    expect(err.message).toContain("missing migration");
  });

  it("omits the migration hint for unrelated codes", () => {
    const err = new QueryError("ctx", pgError({ code: "23505" }));
    expect(err.message).not.toContain("missing migration");
  });

  it("captures hint, details, and context on the instance", () => {
    const err = new QueryError("ctx", pgError({ hint: "h", details: "d", code: "23505" }));
    expect(err.hint).toBe("h");
    expect(err.details).toBe("d");
    expect(err.context).toBe("ctx");
    expect(err.code).toBe("23505");
  });

  it("sets `code` to undefined when none was provided", () => {
    const err = new QueryError("ctx", pgError({ code: undefined as unknown as string }));
    expect(err.code).toBeUndefined();
  });
});

describe("throwQueryError", () => {
  it("throws a QueryError carrying the supplied context", () => {
    let caught: unknown;
    try {
      throwQueryError(pgError({ message: "nope" }), "doing the thing");
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(QueryError);
    expect((caught as QueryError).context).toBe("doing the thing");
    expect((caught as QueryError).message).toBe("doing the thing: nope");
  });
});
