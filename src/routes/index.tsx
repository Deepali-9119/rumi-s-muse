import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rumi Is Your Roomie — Poems for your soul" },
      { name: "description", content: "Share a thought, a wound, a wonder — and receive a poem in the voice of Rumi." },
      { property: "og:title", content: "Rumi Is Your Roomie" },
      { property: "og:description", content: "Share a thought, a wound, a wonder — and receive a poem in the voice of Rumi." },
      { name: "twitter:card", content: "summary_large_image" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
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
  "https://shoot-sept-distribution-championship.trycloudflare.com/webhook-test/307bd27c-c693-4c85-98e2-241a1909a633";

type Entry = {
  id: string;
  topic: string;
  poem?: string;
  error?: string;
  loading: boolean;
};

function extractPoem(data: unknown): string {
  if (typeof data === "string") return data;
  if (Array.isArray(data) && data.length > 0) return extractPoem(data[0]);
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["poem", "output", "text", "response", "message", "result", "content"]) {
      if (typeof obj[key] === "string") return obj[key] as string;
    }
    // nested
    for (const v of Object.values(obj)) {
      if (typeof v === "string" && v.length > 20) return v;
    }
  }
  return "";
}

function Index() {
  const [topic, setTopic] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = topic.trim();
    if (!t || t.length > 500) return;
    const id = crypto.randomUUID();
    setEntries((prev) => [...prev, { id, topic: t, loading: true }]);
    setTopic("");

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
      setEntries((prev) =>
        prev.map((en) => (en.id === id ? { ...en, poem, loading: false } : en)),
      );
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-10 pb-6 px-6 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">A Whispered Reply</p>
        <h1 className="font-display text-5xl md:text-6xl font-medium text-ink">
          Rumi <span className="italic text-gold">is your</span> Roomie
        </h1>
        <p className="mt-4 text-muted-foreground italic font-display text-lg max-w-xl mx-auto">
          Tell him a thought, a wound, a wonder — and he will answer in verse.
        </p>
        <div className="ornament inline-block mt-5 text-sm text-gold/70" />
      </header>

      {/* Scroll area */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8"
      >
        <div className="max-w-2xl mx-auto space-y-12">
          {!hasConversation && (
            <div className="text-center mt-10 opacity-80">
              <p className="font-display italic text-xl text-muted-foreground">
                "Out beyond ideas of wrongdoing and rightdoing,
                <br />
                there is a field. I'll meet you there."
              </p>
              <p className="mt-3 text-xs tracking-widest uppercase text-gold">— Rumi</p>
            </div>
          )}

          {entries.map((e) => (
            <article key={e.id} className="space-y-6">
              {/* User topic */}
              <div className="flex justify-end">
                <div className="max-w-md rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-5 py-3 shadow-sm">
                  <p className="font-body text-base leading-relaxed">{e.topic}</p>
                </div>
              </div>

              {/* Poem */}
              <div className="relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-gold text-2xl select-none">
                  ❦
                </div>
                <div className="border-t border-b border-gold/40 py-8 px-2 md:px-6 text-center">
                  {e.loading && (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse [animation-delay:200ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse [animation-delay:400ms]" />
                      </div>
                      <p className="font-display italic text-muted-foreground text-sm">
                        Rumi is listening to the reed…
                      </p>
                    </div>
                  )}
                  {e.error && (
                    <p className="text-destructive font-body italic">
                      The reed fell silent: {e.error}
                    </p>
                  )}
                  {e.poem && (
                    <div className="font-display text-ink text-xl md:text-2xl leading-[1.9] whitespace-pre-wrap">
                      {e.poem.split("\n").map((line, i) => (
                        <div
                          key={i}
                          className="poem-line"
                          style={{ animationDelay: `${i * 120}ms` }}
                        >
                          {line || "\u00A0"}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {e.poem && (
                  <p className="text-center mt-3 text-xs tracking-[0.3em] uppercase text-gold/80">
                    — Rumi, for you
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Composer */}
      <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-6 px-6">
        <form onSubmit={submit} className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 rounded-2xl border border-gold/50 bg-card/80 backdrop-blur px-4 py-3 shadow-lg focus-within:border-gold transition-colors">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(e as unknown as React.FormEvent);
                }
              }}
              rows={1}
              maxLength={500}
              placeholder="Whisper a topic, a feeling, a question…"
              className="flex-1 resize-none bg-transparent outline-none font-body text-base placeholder:text-muted-foreground/60 max-h-32"
              aria-label="Your topic for Rumi"
            />
            <button
              type="submit"
              disabled={!topic.trim() || entries.some((e) => e.loading)}
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
