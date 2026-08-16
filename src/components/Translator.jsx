import { useState } from "react";
import { Translate, Mic, Volume, Rotate, Sparkle } from "./Icons.jsx";
import { translateNuer } from "../data/translationPipeline.js";

const TABS = [
  { id: "mt", label: "Machine Translation", icon: Translate },
  { id: "asr", label: "Automatic Speech Recognition (ASR)", icon: Mic },
  { id: "tts", label: "Text-to-Speech (TTS)", icon: Volume },
];

const SAMPLE_INPUTS = ["woman", "good morning", "water", "child", "thank you"];

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
  const [result, setResult] = useState({ output: "", source: "", confidence: 0 });
  const [running, setRunning] = useState(false);
  const [direction, setDirection] = useState("en->nuer");

  const isEnglishToNuer = direction === "en->nuer";
  const fromLanguage = isEnglishToNuer ? "English" : "Nuer (Thok Nath)";
  const toLanguage = isEnglishToNuer ? "Nuer (Thok Nath)" : "English";

  const onTranslate = async () => {
    if (!text.trim()) return;
    setRunning(true);
    setResult({ output: "", source: "", confidence: 0 });
    const translation = await translateNuer(text, direction);
    setResult(translation);
    setRunning(false);
  };

  const onSwap = () => {
    setDirection((current) => current === "en->nuer" ? "nuer->en" : "en->nuer");
    setText(result.output || text);
    setResult({ output: "", source: "", confidence: 0 });
  };

  return (
    <section id="models" className="relative">
      <div className="max-w-4xl mx-auto px-6 pb-14">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => setTab(item.id)} className={`chip ${active ? "active" : ""}`} style={{ padding: "0.5rem 1rem" }}>
                <Icon />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {tab !== "mt" ? (
          <div className="card p-8 text-center">
            <Sparkle />
            <h2 className="mt-3 text-lg font-semibold text-ink-900">{tab === "asr" ? "Nuer speech recognition" : "Nuer text-to-speech"}</h2>
            <p className="mt-2 text-sm text-ink-500">This pipeline is being prepared from the local speech data. Translation is ready to try now.</p>
            <button onClick={() => setTab("mt")} className="mt-5 btn-primary">Open translation</button>
          </div>
        ) : (
          <>
            <div className="card p-1.5 shadow-[0_2px_30px_rgba(11,18,32,0.05)]">
              <div className="px-5 pt-5 pb-4">
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder={`Type something in ${fromLanguage} to translate into ${toLanguage}…`}
                  rows={3}
                  className="w-full bg-transparent outline-none resize-none text-[15px] text-ink-900 placeholder:text-ink-400"
                />
              </div>

              <div className="h-px bg-[#E5E7EB]" />

              <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-3">
                <button onClick={() => { setText(""); setResult({ output: "", source: "", confidence: 0 }); }} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition">
                  <Rotate /> Clear
                </button>

                <div className="flex items-center gap-2">
                  <span className="chip"><span className="text-ink-500">From</span><span className="font-medium">{fromLanguage}</span></span>
                  <button onClick={onSwap} title="Swap languages" className="h-9 w-9 rounded-full border border-ink-200 flex items-center justify-center hover:bg-ink-100 transition"><SwapIcon /></button>
                  <span className="chip"><span className="text-ink-500">To</span><span className="font-medium">{toLanguage}</span></span>
                  <button onClick={onTranslate} disabled={!text.trim() || running} className="ml-1 inline-flex items-center justify-center h-9 w-9 rounded-full bg-amber-300 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition" title="Translate"><ArrowUp /></button>
                </div>
              </div>
            </div>

            {result.output && (
              <div className="mt-4 card p-5">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <span className="eyebrow">Translation</span>
                  <span className="text-[11px] text-ink-400">{result.source} · {Math.round(result.confidence * 100)}% confidence</span>
                </div>
                <p className="text-lg text-ink-900 font-medium">{result.output}</p>
              </div>
            )}

            {running && <div className="mt-4 card p-5 flex items-center gap-3 text-ink-500 text-sm"><Sparkle /> Looking up verified translation data…</div>}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-ink-400 mr-1">Try:</span>
              {SAMPLE_INPUTS.map((sample) => <button key={sample} onClick={() => setText(sample)} className="text-xs px-3 py-1.5 rounded-full border border-ink-200 text-ink-500 hover:text-ink-900 hover:border-ink-300 transition">{sample}</button>)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
