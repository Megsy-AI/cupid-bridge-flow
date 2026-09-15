# Megsy — roadmap

## Fixed in the QA pass
- Computer tasks: terminal state (done/failed + result text) is written only after the
  external environment confirms it (`src/lib/computer/client.ts`, `persistTerminalState`).
- Browser steps in the agent tool runtime really execute on the cloud computer instead of
  returning a fake `BROWSER_STEP:` string (`src/lib/agentTools/runtime.ts`).
- The agent cannot declare completion while external work is still running
  (`src/lib/agentkernel/kernel.ts`).
- Execution events are no longer chat messages: one status line while running, steps in a
  collapsed list, only the final report as a message.
- Stale `running` computer rows (>10 min) are reconciled once on load
  (`src/lib/computer/taskIndicators.ts`).
- Desktop blank screen: `src/styles/deferred.css` shipped `@tailwind utilities`, emitting an
  unlayered copy of every utility that beat the responsive variants.
- `/` rendered the template placeholder instead of the SPA (`src/routes/index.tsx`).
- Code blocks vanished from answers: `stripLearnBlocks` had an optional fence flag
  (`src/components/chat/ChatMessage.tsx`).
- Image edit follow-ups ("now make the bicycle red") went to the text model and produced
  nothing; they now route to the image pipeline with the previous image as reference
  (`src/lib/media/autoMediaIntent.ts`, `detectImageEditIntent`).
- Cost: the mandatory reviewer round-trip was removed; the higher reviewer runs only when
  self-review finds a real gap.
- Unstyled/broken first paint: every stylesheet was imported from `src/lib/spaBoot.ts`, a
  client-only dynamic chunk, so the server HTML carried no stylesheet. All render-critical
  CSS now lives in `src/styles/app.css`, imported by `src/routes/__root.tsx`, so it ships as
  a `<link>` with the document. Import order preserved.
- Dark flash before the light UI: the boot shell was hard-coded dark while the default theme
  is light. `THEME_BOOT_SCRIPT` in `__root.tsx` resolves the stored theme before first paint
  and `BOOT_STYLE` is theme-aware (auth screens stay dark).
- Dead code: 60 unreachable modules deleted (unused shadcn primitives, `serviceRouter`,
  `intentDetector`, `openManus`, `coderStackBlitz`, `persistentCache`, …), the leftover
  template `src/styles.css` removed, and 26 unused npm packages dropped (antd, recharts,
  `@lobehub/ui`, `@imgly/background-removal`, unused Radix packages, …).

## Open
- React 19 warning "Cannot update a component while rendering a different component"
  (Transitioner / nested BrowserRouter). Noisy only; the fix touches SPA boot.
- On mobile, Enter inserts a newline instead of sending; only the Send button sends.
- The Learning mode chip needs horizontal scrolling in the mobile mode bar to be reachable.
- MCP / Integrations and Files were not exercised end to end in this pass.
