import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import moonAsset from "@/assets/moon.jpg.asset.json";
import featherAsset from "@/assets/feather.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rumi Is Your Roomie — Poems for your soul" },
      { name: "description", content: "Share a thought, a wound, a wonder — and receive a poem in the voice of Rumi." },
      { property: "og:title", content: "Rumi Is Your Roomie" },
      { property: "og:description", content: "Share a thought, a wound, a wonder — and receive a poem in the voice of Rumi." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap",
      },
    ],
  }),
  component: Index,
});

const WEBHOOK_URL =
  "https://treat-blackberry-encryption-eye.trycloudflare.com/webhook/307bd27c-c693-4c85-98e2-241a1909a633";

const MOON_URL = moonAsset.url;
const FEATHER_URL = featherAsset.url;

const CHAR_MS = 42;
const LINE_GAP_MS = 480;
const BLANK_LINE_MS = 900;

type Entry = {
  id: string;
  topic: string;
  poem?: string;
  error?: string;
  loading: boolean;
  lines: string[];
  revealedFull: number;
  currentText: string;
  typing: boolean;
  glow: boolean;
};

function extractPoem(data: unknown): string {
  if (typeof data === "string") return data;
  if (Array.isArray(data) && data.length > 0) return extractPoem(data[0]);
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["poem", "output", "text", "response", "message", "result", "content"]) {
      if (typeof obj[key] === "string") return obj[key] as string;
    }
    for (const v of Object.values(obj)) {
      if (typeof v === "string" && v.length > 20) return v;
    }
  }
  return "";
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function Index() {
  const [topic, setTopic] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const entryRefs = useRef<Record<string, HTMLElement | null>>({});
  const timeoutsRef = useRef<number[]>([]);

  const busy = entries.some((e) => e.loading || e.typing);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const scrollToEntry = useCallback((id: string, block: ScrollLogicalPosition = "start") => {
    requestAnimationFrame(() => {
      const el = entryRefs.current[id];
      if (el) el.scrollIntoView({ behavior: "smooth", block });
    });
  }, []);

  const startTypewriter = useCallback((id: string, fullPoem: string) => {
    const lines = fullPoem.split("\n");
    const reduced = prefersReducedMotion();

    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              poem: fullPoem,
              lines,
              loading: false,
              typing: !reduced,
              revealedFull: reduced ? lines.length : 0,
              currentText: "",
            }
          : e,
      ),
    );

    if (reduced) {
      const t = window.setTimeout(() => {
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, glow: true } : e)));
        scrollToEntry(id, "center");
        const t2 = window.setTimeout(() => {
          setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, glow: false } : e)));
        }, 3200);
        timeoutsRef.current.push(t2);
      }, 50);
      timeoutsRef.current.push(t);
      return;
    }

    let lineIdx = 0;
    let charIdx = 0;

    const step = () => {
      if (lineIdx >= lines.length) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === id ? { ...e, typing: false, currentText: "", revealedFull: lines.length, glow: true } : e,
          ),
        );
        scrollToEntry(id, "center");
        const tEnd = window.setTimeout(() => {
          setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, glow: false } : e)));
        }, 3200);
        timeoutsRef.current.push(tEnd);
        return;
      }

      const line = lines[lineIdx];

      if (line.length === 0) {
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, revealedFull: lineIdx + 1, currentText: "" } : e)),
        );
        lineIdx += 1;
        charIdx = 0;
        const t = window.setTimeout(step, BLANK_LINE_MS);
        timeoutsRef.current.push(t);
        return;
      }

      if (charIdx <= line.length) {
        const partial = line.slice(0, charIdx);
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, currentText: partial, revealedFull: lineIdx } : e)),
        );
        charIdx += 1;
        const t = window.setTimeout(step, CHAR_MS);
        timeoutsRef.current.push(t);
      } else {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === id ? { ...e, revealedFull: lineIdx + 1, currentText: "" } : e,
          ),
        );
        lineIdx += 1;
        charIdx = 0;
        const t = window.setTimeout(step, LINE_GAP_MS);
        timeoutsRef.current.push(t);
      }
    };

    const tStart = window.setTimeout(step, 350);
    timeoutsRef.current.push(tStart);
  }, [scrollToEntry]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = topic.trim();
    if (!t || t.length > 500 || busy) return;
    const id = crypto.randomUUID();
    setEntries((prev) => [
      ...prev,
      {
        id,
        topic: t,
        loading: true,
        lines: [],
        revealedFull: 0,
        currentText: "",
        typing: false,
        glow: false,
      },
    ]);
    setTopic("");
    scrollToEntry(id, "start");

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const ct = res.headers.get("content-type") ?? "";
      let poem = "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        poem = extractPoem(data);
      } else {
        poem = await res.text();
      }
      if (!poem) poem = "Silence answered — try again with another whisper.";
      startTypewriter(id, poem.trim());
    } catch (err) {
      setEntries((prev) =>
        prev.map((en) =>
          en.id === id
            ? { ...en, loading: false, error: err instanceof Error ? err.message : "Something went wrong" }
            : en,
        ),
      );
    }
  };

  const hasConversation = entries.length > 0;
  const lastIndex = entries.length - 1;

  const dust = Array.from({ length: 14 }, (_, i) => {
    const x = (i * 73) % 100;
    const size = 1 + ((i * 7) % 4) * 0.6;
    const duration = 22 + ((i * 11) % 20);
    const delay = (i * 2.3) % 18;
    const sway = ((i % 2 === 0 ? 1 : -1) * (15 + (i * 5) % 30));
    return { x, size, duration, delay, sway, key: i };
  });

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="sky-layer sky-stars" aria-hidden="true" />
      <div className="sky-layer sky-moonglow" aria-hidden="true" />
      <div className="sky-layer sky-vignette" aria-hidden="true" />
      <div className="stardust" aria-hidden="true">
        {dust.map((d) => (
          <span
            key={d.key}
            style={{
              ['--x' as string]: `${d.x}%`,
              ['--size' as string]: `${d.size}px`,
              ['--duration' as string]: `${d.duration}s`,
              ['--delay' as string]: `${d.delay}s`,
              ['--sway' as string]: `${d.sway}px`,
            }}
          />
        ))}
      </div>

      <header className="pt-10 pb-6 px-6 text-center relative z-10">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">A Whispered Reply</p>
        <h1 className="font-display text-5xl md:text-6xl font-medium" style={{ color: "var(--sky-foreground)" }}>
          <span className="text-gold/70 mr-3 text-2xl align-middle">✦</span>
          Rumi <span className="italic text-gold">is your</span> Roomie
          <span className="text-gold/70 ml-3 text-2xl align-middle">✦</span>
        </h1>
        <p className="mt-4 italic font-display text-lg max-w-xl mx-auto" style={{ color: "var(--sky-muted)" }}>
          Tell him a thought, a wound, a wonder — and he will answer in verse.
        </p>
        <div className="ornament inline-block mt-5 text-sm text-gold/70" />
      </header>

      <main className="flex-1 px-6 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-10">
          {!hasConversation && (
            <div className="text-center mt-10 opacity-90">
              <p className="font-display italic text-xl" style={{ color: "var(--sky-muted)" }}>
                "Out beyond ideas of wrongdoing and rightdoing,
                <br />
                there is a field. I'll meet you there."
              </p>
              <p className="mt-3 text-xs tracking-widest uppercase text-gold">— Rumi</p>
            </div>
          )}


          {entries.map((e, i) => {
            const isLatest = i === lastIndex;

            if (!isLatest) {
              return (
                <details
                  key={e.id}
                  className="history-card group rounded-xl border border-gold/40 px-5 py-3 hover:border-gold/70 backdrop-blur-md"
                  style={{ background: "color-mix(in oklab, var(--parchment) 88%, transparent)" }}
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                    <span className="font-display italic text-lg text-ink truncate">
                      <span className="text-gold mr-2">✦</span>
                      {e.topic}
                    </span>
                    <svg
                      className="chev w-4 h-4 text-gold shrink-0 ml-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="mt-5 border-t border-gold/30 pt-5 font-display text-ink text-lg md:text-xl leading-[1.9] whitespace-pre-wrap text-center">
                    {e.poem || (e.error ? <span className="text-destructive italic">{e.error}</span> : null)}
                  </div>
                  {e.poem && (
                    <p className="text-center mt-3 text-[10px] tracking-[0.3em] uppercase text-gold/70">
                      — Rumi, for you
                    </p>
                  )}
                </details>
              );
            }

            const showPoem = !e.loading && !e.error && e.lines.length > 0;

            return (
              <article
                key={e.id}
                ref={(el) => {
                  entryRefs.current[e.id] = el;
                }}
                className="entry-mount space-y-6 scroll-mt-24"
              >
                <div className="flex justify-end">
                  <div className="max-w-md rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-5 py-3 shadow-sm">
                    <p className="font-body text-base leading-relaxed">{e.topic}</p>
                  </div>
                </div>

                <div className={`canvas-card ${e.glow ? "poem-glow" : ""}`}>
                  {showPoem && (
                    <img
                      key={`moon-${e.id}`}
                      src={MOON_URL}
                      alt=""
                      aria-hidden="true"
                      className="canvas-moon"
                    />
                  )}
                  <div className="canvas-veil" aria-hidden="true" />

                  <div className="relative px-6 md:px-10 py-10">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 text-gold text-2xl select-none">
                      ❦
                    </div>

                    <div className="flex justify-start mb-2">
                      <img
                        src={FEATHER_URL}
                        alt=""
                        aria-hidden="true"
                        className={`feather-img ${e.loading ? "feather-write" : "feather-float"}`}
                      />
                    </div>

                    <div className="border-t border-b border-gold/40 py-8 text-center min-h-[220px] flex items-center justify-center">
                      {e.loading && (
                        <div
                          className="flex flex-col items-center gap-3 py-6"
                          role="status"
                          aria-live="polite"
                        >
                          <p className="breathe font-display italic text-xl text-ink">
                            <span className="text-gold mr-2">✦</span>
                            Rumi is writing...
                          </p>
                        </div>
                      )}

                      {e.error && (
                        <p className="text-destructive font-body italic">
                          The reed fell silent: {e.error}
                        </p>
                      )}

                      {showPoem && (
                        <div
                          className="font-display text-ink text-xl md:text-2xl leading-[1.95] whitespace-pre-wrap w-full"
                          aria-live="polite"
                        >
                          {e.lines.map((line, idx) => {
                            if (idx < e.revealedFull) {
                              return (
                                <div key={idx} className="poem-line">
                                  {line || "\u00A0"}
                                </div>
                              );
                            }
                            if (idx === e.revealedFull && e.typing) {
                              return (
                                <div key={idx} className="poem-line">
                                  {e.currentText}
                                  <span className="caret">▍</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                    {!e.loading && !e.typing && e.poem && (
                      <p className="text-center mt-4 text-xs tracking-[0.3em] uppercase text-gold/80">
                        — Rumi, for you
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-6 px-6">
        <form onSubmit={submit} className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 rounded-2xl border border-gold/50 bg-card/80 backdrop-blur px-4 py-3 shadow-lg focus-within:border-gold transition-colors">
            <textarea
              value={topic}
              onChange={(ev) => setTopic(ev.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" && !ev.shiftKey) {
                  ev.preventDefault();
                  submit(ev as unknown as React.FormEvent);
                }
              }}
              rows={1}
              maxLength={500}
              disabled={busy}
              placeholder={busy ? "Rumi is composing your verse…" : "Whisper a topic, a feeling, a question…"}
              className="flex-1 resize-none bg-transparent outline-none font-body text-base placeholder:text-muted-foreground/60 max-h-32 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Your topic for Rumi"
            />
            <button
              type="submit"
              disabled={!topic.trim() || busy}
              className="shrink-0 rounded-full bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105"
              aria-label="Send to Rumi"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M5 12l14-7-7 14-2-5-5-2z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground/70 mt-2 italic font-display">
            Press Enter to send · Shift+Enter for a new line
          </p>
        </form>
      </div>
    </div>
  );
}
