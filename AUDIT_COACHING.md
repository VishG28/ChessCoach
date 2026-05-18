# AUDIT_COACHING — Coaching System Verification

## Summary
- 5/10 PASS, 2 PARTIAL, 3 FAIL

---

## Findings

### 1. Five coaching modes implemented
**Status:** PARTIAL

**Evidence:**
- `src/coaching/deepCoach.ts:6` — `CoachingStyle` type has three values: `'conversational' | 'socratic' | 'tactical'`
- `src/components/sidebar/LeftSidebar.tsx:250-252` — UI exposes exactly those three options: Conversational, Socratic, Tactical Drills
- `src/coaching/deepCoach.ts:55-66` — `DEEP_DIVE_SYSTEM` prompt exists (used when `depth === 'deep_dive'`), triggered via "Tell me more"
- `src/coaching/deepCoach.ts:68-73` — `RETROSPECTIVE_SYSTEM` prompt exists (used when `depth === 'retrospective'`)
- `src/coaching/deepCoach.ts:77-84` — `systemPromptFor()` dispatches on `depth` first, then `style`

**Notes:** The spec calls for five distinct user-selectable coaching modes. Deep Dive and Retrospective exist as prompt depths/triggers, not as selectable modes. Deep Dive is an on-demand follow-up action; Retrospective is accessible only from `GameReviewPage`. Neither appears in the coaching-style radio group in `LeftSidebar.tsx`. Only three modes (Conversational, Socratic, Tactical Drills) are presented to the user as selectable styles.

---

### 2. System prompts match Phase 5/6 spec (brief, surgical, bullet-pointed, hard rules)
**Status:** PASS

**Evidence:**
- `src/coaching/deepCoach.ts:8-27` — `CONVERSATIONAL_SYSTEM`: "Output ONLY bullet points in markdown, never prose." Hard rules: max 3 bullets, each max 15 words, no nested bullets in live mode, no preamble.
- `src/coaching/deepCoach.ts:29-43` — `SOCRATIC_SYSTEM`: "Output ONLY a single bullet point containing one question." Hard rules: exactly one bullet, max 15 words.
- `src/coaching/deepCoach.ts:45-53` — `TACTICAL_SYSTEM`: "Output ONLY one bullet." Hard rules: exactly one bullet, max 20 words.
- `src/coaching/deepCoach.ts:55-66` — `DEEP_DIVE_SYSTEM`: structured bullets with nesting allowed, max 4 top-level bullets.
- `src/coaching/deepCoach.ts:68-73` — `RETROSPECTIVE_SYSTEM`: structured bullet format with five named fields.
- `src/coaching/deepCoach.ts:202-205` — Token budgets enforced: brief=180 max_tokens, retrospective=400, deep_dive=500.

**Notes:** All five prompts are surgical and bullet-only. Hard rules are explicit in each. Token max_tokens enforcement adds a second layer of length control.

---

### 3. Pre-move coaching debounced 800ms, cached by FEN
**Status:** PASS

**Evidence:**
- `src/coaching/useDeepCoach.ts:53` — `const DEBOUNCE_MS = 800`
- `src/coaching/useDeepCoach.ts:54` — `const GLOBAL_RATE_MS = 3000` (additional global rate limit)
- `src/coaching/useDeepCoach.ts:199` — `const wait = Math.max(0, GLOBAL_RATE_MS - sinceLast, DEBOUNCE_MS)` — both 800ms debounce and global rate applied
- `src/coaching/useDeepCoach.ts:172` — cache write: `if (opts.trigger === 'pre_move') cacheRef.current.set(opts.fen, finalMsg)`
- `src/coaching/useDeepCoach.ts:192-195` — cache read: checks `cacheRef.current.get(opts.fen)` and short-circuits if hit

**Notes:** The spec says 800ms debounce. Actual wait is `Math.max(0, GLOBAL_RATE_MS - sinceLast, DEBOUNCE_MS)` which is more conservative — acceptable. Cache is in-memory (React ref), keyed by FEN, pre-move only.

---

### 4. Post-move coaching trigger: centipawn loss > 80 OR missed-tactic delta > 150cp
**Status:** FAIL

**Evidence:**
- `src/coaching/blunder.ts:4` — `export const BLUNDER_CP = 200`
- `src/coaching/blunder.ts:26-28` — `isBlunder(loss): boolean { return loss > BLUNDER_CP }` — threshold is 200cp, not 80cp
- `src/coaching/useCoach.ts:153-160` — blunder alert fires only when `isBlunder(loss)` is true (i.e., > 200cp)
- `src/coaching/useExplain.ts:39-44` — classifies moves as inaccuracy (>=80cp), mistake (>=150cp), blunder (>=300cp), missed_tactic (<80cp); this is for labeling only, not a trigger threshold
- `src/pages/PlayPage.tsx:235` — LLM explanation enabled only when `blunderAlert !== null && coachMode === 'full'`; blunderAlert only fires at 200cp
- `src/pages/PlayPage.tsx:370,383` — only two `deepCoach.fire` calls exist; both are `trigger: 'pre_move'` or `trigger: 'tell_me_more'`; no `trigger: 'post_move'` call exists

**Notes:** The spec requires coaching to trigger at centipawn loss > 80 OR missed-tactic delta > 150cp. The implementation only triggers coaching at 200cp loss. The 80cp and 150cp thresholds in `useExplain.ts` are classification labels only, not coaching triggers.

---

### 5. Game-end ephemeral coach wipe
**Status:** PASS

**Evidence:**
- `src/games/gameStore.ts:134-150` — `clearGameCoaching(gameId)` zeroes `coach_messages` and `coach_message` on every move entry before writing to storage
- `src/games/useGameLogger.ts:202-236` — on `justEnded` (game over) with `!keepCoaching`, calls `clearGameCoaching(finalizedGameId)`
- `src/games/useGameLogger.ts:210-213` — reads `localStorage.getItem('cc.keepCoaching.v1')` to check user preference before wiping
- `src/games/useGameLogger.ts:219-231` — wipe performed with toast and undo action (restores snapshot via `restoreGameCoaching`)

**Notes:** The wipe fires on any `game.isGameOver` transition (`useGameLogger.ts:201`), which covers checkmate, stalemate, draw-by-repetition, and all other chess.js terminal states. Resignation/abandonment would be reflected as game-over states in the client. The user-configurable `keepCoaching` preference is stored as a boolean flag (not the key) in localStorage.

---

### 6. Bullet output with hard length limits per mode
**Status:** PASS

**Evidence:**
- `src/coaching/deepCoach.ts:20-26` — CONVERSATIONAL: "Maximum 3 bullets ever, no exceptions. Each bullet maximum 15 words."
- `src/coaching/deepCoach.ts:38-43` — SOCRATIC: "Exactly one bullet. Maximum 15 words in the question."
- `src/coaching/deepCoach.ts:50-53` — TACTICAL: "Exactly one bullet. Maximum 20 words."
- `src/coaching/deepCoach.ts:202-205` — Token limits: brief=180, retrospective=400, deep_dive=500

**Notes:** Hard rules are explicit in the prompt text and enforced by max_tokens. The retrospective prompt (`deepCoach.ts:68-73`) has no explicit word-count rule, only structural field requirements; the 400-token ceiling acts as backstop.

---

### 7. `cache_control: { type: "ephemeral" }` on static coaching instructions
**Status:** FAIL

**Evidence:**
- Searched all files under `src/coaching/` for `cache_control` — zero matches found
- `src/coaching/deepCoach.ts:206-214` — `client.messages.stream()` call passes `system` as a plain string, no `cache_control` wrapper
- `src/coaching/llmCoach.ts:46-52` — raw `fetch` body contains `system` as a plain string, no `cache_control`
- No use of `cache_creation_input_tokens` or `cache_read_input_tokens` anywhere in the codebase

**Notes:** Prompt caching via `cache_control: { type: "ephemeral" }` is entirely absent. The five system prompts are static strings that never change between calls and are prime candidates for caching. Without this, every API call pays full input-token cost on the system prompt. This is the expected FAIL flagged in the audit spec.

---

### 8. Cost telemetry uses `usage.cache_creation_input_tokens` and `usage.cache_read_input_tokens`
**Status:** FAIL

**Evidence:**
- `src/coaching/deepCoach.ts:224-228` — usage object reads only `final.usage.input_tokens` and `final.usage.output_tokens`
- `src/coaching/deepCoach.ts:232-235` — `usdCost()` uses only `inputTokens` and `outputTokens` at $3/M and $15/M; no cache-read pricing ($0.30/M)
- `src/coaching/costCounter.tsx` — `CostCounterProvider` accumulates USD total via `add(delta)` with no cache token fields
- `src/components/nav/SessionCost.tsx:4-15` — displays `$usd.toFixed(2)` from cost counter; no cache breakdown

**Notes:** Cache token fields are not read and not tracked. Since prompt caching is not implemented (Item 7), the API never returns these fields. The cost counter would also need updated pricing logic to account for cache hits at $0.30/M vs uncached $3/M.

---

### 9. API key: session-only in-memory, unicode cleaner strips em-dashes / zero-width spaces
**Status:** PASS

**Evidence:**
- `src/coaching/apiKey.tsx:39` — `const keyRef = useRef<string | null>(null)` — key lives in a React ref, never in React state, localStorage, sessionStorage, or cookies
- `src/components/coaching/ApiKeyDialog.tsx:99` — dialog text: "Your key is held in memory for this browser tab only. It is never saved to disk, localStorage, cookies, or any server we control."
- `src/lib/sanitizeApiKey.ts:7` — `const DASH_LOOKALIKES = /[‐-―−]/g` — strips hyphens, en-dashes, em-dashes, minus signs
- `src/lib/sanitizeApiKey.ts:12` — `const NON_ASCII = /[^\x00-\x7F]/g` — catches all non-ASCII including zero-width spaces (U+200B, U+FEFF, etc.)
- `src/lib/sanitizeApiKey.ts:15-34` — `sanitizeApiKey()` replaces dash lookalikes, normalizes whitespace, removes non-ASCII, validates `sk-ant-` shape
- `src/components/coaching/ApiKeyDialog.tsx:40-46` — sanitizer applied on paste; warning toasted if non-ASCII removed
- `src/components/coaching/ApiKeyDialog.tsx:77` — only `cc.keepCoaching.v1` preference (not the key) is persisted to localStorage

**Notes:** `sanitizeApiKey.ts` is in `src/lib/`, not `src/coaching/` as the spec implied, but is imported and used by `ApiKeyDialog.tsx`. The key itself never touches persistent storage. PASS.

---

### 10. "Tell me more" button expands previous brief coaching into Deep Dive
**Status:** PARTIAL

**Evidence:**
- `src/components/coaching/TellMoreButton.tsx:1-33` — component exists, appears after 1000ms delay, calls `onClick`
- `src/components/coaching/CoachPanel.tsx:103` — `const tellMoreHandler = requestDeepDive ?? onTellMore`
- `src/components/coaching/CoachPanel.tsx:153-159` — `TellMoreButton` rendered under each completed brief message when `isBrief && !msg.streaming && !!tellMoreHandler`
- `src/coaching/useDeepCoach.ts:213-275` — `requestDeepDive(sourceId)` re-issues the original context with `depth: 'deep_dive'`, correctly invoking `DEEP_DIVE_SYSTEM` prompt
- `src/pages/PlayPage.tsx:804` — `onTellMore={handleTellMore}` is passed; `requestDeepDive` prop is NOT passed to `CoachPanel`
- `src/pages/PlayPage.tsx:380-390` — `handleTellMore` calls `deepCoach.fire({ trigger: 'tell_me_more', depth: msg.depth, followUp: '...' })` — passes `msg.depth` which is one of `'quick' | 'detail' | 'critical'` (the `useDeepCoach` CoachDepth enum)

**Notes:** Two Tell-Me-More paths exist. The correct path (`requestDeepDive`) uses `depth: 'deep_dive'` and routes to `DEEP_DIVE_SYSTEM`. However, PlayPage passes only the legacy `onTellMore`, not `requestDeepDive`. The legacy path passes `depth: msg.depth` where `msg.depth` is `'detail'` (from `useDeepCoach.ts:56` enum `'quick' | 'detail' | 'critical'`). In `deepCoach.ts`'s `systemPromptFor()`, neither `'detail'` nor `'quick'` nor `'critical'` matches `'deep_dive'` or `'retrospective'`, so the function falls through to the style-based switch — returning `CONVERSATIONAL_SYSTEM` (or whichever style is active), NOT `DEEP_DIVE_SYSTEM`. Tell-Me-More in the live game does not invoke the Deep Dive prompt.

---

## Other observations

**Blunder threshold vs spec:** The spec says coaching triggers at >80cp or >150cp missed-tactic. The actual trigger (`BLUNDER_CP = 200`) is more conservative. The 80/150 thresholds exist only as classification labels in `useExplain.ts:39-44`, not as triggers.

**Two Anthropic call paths:** `llmCoach.ts` uses raw `fetch`; `deepCoach.ts` uses `@anthropic-ai/sdk`. Neither implements prompt caching. `llmCoach.ts` (`explainBlunder`) appears to be a legacy path superseded by `useExplain → streamCoachMessage`, but is still imported for API key ping validation (`pingAnthropic`).

**CoachDepth enum split:** `useDeepCoach.ts:56` defines `CoachDepth = 'quick' | 'detail' | 'critical'`; `deepCoach.ts:75` defines `CoachDepth = 'brief' | 'deep_dive' | 'retrospective'`. Both are exported under the same name. The `depth` field in `LiveCoachMessage` uses the former enum; `streamCoachMessage`'s `depth` option uses the latter. They are never reconciled when `handleTellMore` passes `msg.depth` to `deepCoach.fire`, causing the Deep Dive prompt to be unreachable from the live game Tell-Me-More path.

**Explanation cache persists across sessions:** `src/coaching/explanationCache.ts:13,28` stores LLM explanation text in `localStorage` under `cc.llm.cache.v1`. This is explanation text only (not the key), but it means prior position explanations survive tab close — an intentional design choice, not a security issue.
