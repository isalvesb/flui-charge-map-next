import assert from "node:assert/strict";
import test from "node:test";

import { stepReveal, type RevealSession } from "../src/features/assistant/revealSession";

test("a segunda abertura anima de novo depois que o fechamento terminou", () => {
  let session: RevealSession = { opening: false, closing: false };

  let step = stepReveal(session, true);
  assert.equal(step.action, "open");
  session = step.session;

  session = { opening: false, closing: true };
  step = stepReveal(session, true);
  assert.equal(step.action, "hold");

  step = stepReveal(session, false);
  assert.equal(step.action, "reset");
  assert.deepEqual(step.session, { opening: false, closing: false });
  session = step.session;

  step = stepReveal(session, true);
  assert.equal(step.action, "open");
});
