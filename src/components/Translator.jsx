import { useState } from "react";
import { Translate, Mic, Volume, Rotate, Sparkle, ChevronDown } from "./Icons";
import { translate as runTranslate } from "../data/translator";
import { supportedLanguages } from "../data/translations";

const TABS = [
  { id: "mt", label: "Machine Translation", icon: Translate },
  { id: "asr", label: "Automatic Speech Recognition (ASR)", icon: Mic },
  { id: "tts", label: "Text-to-Speech (TTS)", icon: Volume },
];

const SAMPLE_INPUTS = [
  "How are you?",
  "Good morning.",
  "Thank you.",
  "The cattle are grazing.",
  "Water is life.",
];

const ArrowUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
  </svg>
);

const SwapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

export default function Translator() {
  const [tab, setTab] = useState("mt");
  const [text, setText] = useState("");
  const [result, setResult] = useState({ output: "", source: "empty", confidence: 0 });
  const [running, setRunning] = useState(false);

  const [sourceLangCode, setSourceLangCode] = useState(supportedLanguages[0]?.code || "en");
  const [targetLangCode, setTargetLangCode] = useState(supportedLanguages[1]?.code || "nuer");

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const fromLang = supportedLanguages.find((l) => l.code === sourceLangCode) || supportedLanguages[0];
  const toLang = supportedLanguages.find((l) => l.code === targetLangCode) || supportedLanguages[1];

  const directionString = `${sourceLangCode}->${targetLangCode}`;

  const onTranslate = () => {
    setRunning(true);
    setResult({ output: "", source: "empty", confidence: 0 });
    setTimeout(() => {
      setResult(runTranslate(text, directionString));
      setRunning(false);
    }, 350);
  };

  const onSwap = () => {
    setSourceLangCode(targetLangCode);
    setTargetLangCode(sourceLangCode);
    setText(result.output || text);
    setResult({ output: "", source: "empty", confidence: 0 });
  };

  const handleSelectSource = (code) => {
    if (code === targetLangCode) {
      onSwap();
    } else {
      setSourceLangCode(code);
    }
    setFromOpen(false);
  };

  const handleSelectTarget = (code) => {
    if (code === sourceLangCode) {
      onSwap();
    } else {
      setTargetLangCode(code);
    }
    setToOpen(false);
  };

  return (
    <section className="relative">
      <div className="max-w-4xl mx-auto px-6 pb-14">
        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`chip ${active ? "active" : ""}`}
                style={{ padding: "0.5rem 1rem" }}
              >
                <Icon />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Translator card */}
        <div className="card p-1.5 shadow-[0_2px_30px_rgba(11,18,32,0.05)]">
          <div className="px-5 pt-5 pb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Type something in ${fromLang.name} to translate into ${toLang.name}…`}
              rows={3}
              className="w-full bg-transparent outline-none resize-none text-[15px] text-ink-900 placeholder:text-ink-400"
            />
          </div>

          <div className="h-px bg-[#E5E7EB]" />

          <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-3">
            <button
              onClick={() => { setText(""); setResult({ output: "", source: "empty", confidence: 0 }); }}
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition"
            >
              <Rotate /> Clear
            </button>

            <div className="flex items-center gap-2 relative">
              {/* FROM Language Dropdown Selection */}
              <div className="relative">
                <button
                  onClick={() => { setFromOpen(!fromOpen); setToOpen(false); }}
                  className="chip inline-flex items-center gap-1.5"
                >
                  <span className="text-ink-500">From</span>
                  <span className="font-medium">{fromLang.name}</span>
                  <ChevronDown />
                </button>
                
                {fromOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectSource(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${sourceLangCode === lang.code ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Toggle/Swap Action */}
              <button
                onClick={onSwap}
                title="Swap languages"
                className="h-9 w-9 rounded-full border border-ink-200 flex items-center justify-center hover:bg-ink-100 transition"
              >
                <SwapIcon />
              </button>

              {/* TO Language Dropdown Selection */}
              <div className="relative">
                <button
                  onClick={() => { setToOpen(!toOpen); setFromOpen(false); }}
                  className="chip inline-flex items-center gap-1.5"
                >
                  <span className="text-ink-500">To</span>
                  <span className="font-medium">{toLang.name}</span>
                  <ChevronDown />
                </button>

                {toOpen && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectTarget(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${targetLangCode === lang.code ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={onTranslate}
                disabled={!text.trim() || running}
                className="ml-1 inline-flex items-center justify-center h-9 w-9 rounded-full bg-amber-300 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Translate"
              >
                <ArrowUp />
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        {result.output && (
          <div className="mt-4 card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="eyebrow">Translation</span>
              <span className="text-[11px] text-ink-400">
                {result.source} · {Math.round(result.confidence * 100)}% confidence
              </span>
            </div>
            <p className="text-lg text-ink-900 font-medium">{result.output}</p>
          </div>
        )}

        {running && (
          <div className="mt-4 card p-5 flex items-center gap-3 text-ink-500 text-sm">
            <Sparkle />
            Running NLLB-Thok Naath on your input…
          </div>
        )}

        {/* Sample chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-ink-400 mr-1">Try:</span>
          {SAMPLE_INPUTS.map((s) => (
            <button
              key={s}
              onClick={() => setText(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-ink-200 text-ink-500 hover:text-ink-900 hover:border-ink-300 transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
