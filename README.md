# Dayom AI Studio

A studio experience for Dayom Lab — chat, translate, transcribe, and synthesize
speech for **Nuer (Thok Naath)** and **Dinka (Thuɔŋjäŋ)** — modeled after
[Khaya AI Studio](https://studio.khaya.ai), built with the visual system from
[NAATH-ARCHIVE/Ai_lab](https://github.com/NAATH-ARCHIVE/Ai_lab), and powered by
the working translation/ASR/TTS logic from
[bielng/Dayom_new_features](https://github.com/bielng/Dayom_new_features).

## What's here

- **`/` — Dayom Lab homepage.** The original Ai_lab landing page. Its
  "Try Naath AI" button is now **"Translate for free"** and opens the Studio.
- **`/#/studio` — Dayom AI Studio**, with its own nav:
  - **Home** — overview / dashboard linking to each tool
  - **Chat Assistant** — small local-knowledge-base Nuer/Dinka chat
  - **Text Translation** — English ⇄ Nuer ⇄ Dinka, via Google Translate
  - **Speech Recognition** — browser speech-to-text, then translation
  - **Text to Speech** — Nuer/Dinka speech synthesis via a hosted model
  - A single **"Back to main site"** link returns to the homepage.

Routing is a tiny hash router (`#/`, `#/studio`, `#/studio/chat`, …) — no
router dependency needed, and it works fine from a single static HTML file.

## Design system

All colors, type, buttons, cards, and chips are the tokens defined in
`src/index.css`, taken directly from Ai_lab's `@theme` block (cream / amber /
ink palette, Inter font, pill buttons, `.card`, `.chip`, `.eyebrow`, etc.).
The hand-drawn icon set in `src/components/Icons.jsx` is Ai_lab's original set
extended with a few more icons in the same minimal stroke style.

## Notes on the source repos

- Ai_lab's original `Translator.jsx` and `NaathChat.jsx` import JSON dataset
  files under `src/data/dataset/` that aren't committed to the repo, so they
  don't build as-is. This project leaves those out of the homepage and
  instead ships fully working equivalents in the Studio:
  - Translation and the ASR page use the free, unofficial Google Translate
    endpoint from `Dayom_new_features` (`src/services/translate.js`).
  - Text to Speech calls a hosted Gradio Space
    (`dayomtechnologies/Text_To_Speech_Thok_Naath`) via `@gradio/client`
    (`src/services/tts.js`), same as `Dayom_new_features`.
  - Chat Assistant ships a small, self-contained starter phrase list
    (`src/data/chatKnowledge.js`) so it works out of the box with no missing
    files — swap in a real dataset/model whenever it's ready.
- Translation, speech recognition, and speech synthesis all call out to the
  network from the browser, so they need an internet connection and (for
  voice input) microphone permission and a Chromium-based or Safari browser.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build      # production build — outputs a single dist/index.html
                    # (vite-plugin-singlefile inlines all JS/CSS)
npm run preview    # preview the production build
```
