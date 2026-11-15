"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { localToday } from "@/lib/dates";
import { stats, type Entry } from "@/lib/stats";
import { Heatmap } from "@/components/heatmap";
import { History } from "@/components/history";

const primary = "rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [creating, setCreating] = useState(false);
  const [authError, setAuthError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [today, setToday] = useState("");
  const [date, setDate] = useState("");
  const user = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    let changed = false;
    const update = (next: Session | null) => {
      if (!active) return;
      user.current = next?.user.id ?? null;
      setSession(next);
      setReady(true);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      changed = true;
      update(next);
    });
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!changed) update(data.session);
      if (active && error) setAuthError(error.message);
    });
    let shown = "";
    const refreshDate = () => {
      const before = shown;
      const next = localToday();
      shown = next;
      setToday(next);
      setDate(previous => !previous || previous === before ? next : previous);
    };
    refreshDate();
    window.addEventListener("focus", refreshDate);
    const timer = window.setInterval(refreshDate, 60000);
    return () => { active = false; subscription.unsubscribe(); window.removeEventListener("focus", refreshDate); window.clearInterval(timer); };
  }, []);

  async function loadEntries(owner: string) {
    const all: Entry[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabase.from("entries").select("id,date,word_count,description,created_at").order("date", { ascending: false }).order("created_at", { ascending: false }).order("id", { ascending: false }).range(offset, offset + 999);
      if (user.current !== owner) return;
      if (error) { setError(error.message); return; }
      all.push(...data);
      if (data.length < 1000) break;
    }
    if (user.current === owner) setEntries([...new Map(all.map(entry => [entry.id, entry])).values()]);
  }

  const owner = session?.user.id;
  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      setEntries([]);
      setError("");
      if (owner) void loadEntries(owner);
    });
    return () => { cancelled = true; };
  }, [owner]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setAuthError("");
    const form = new FormData(event.currentTarget);
    const credentials = { email: String(form.get("email")), password: String(form.get("password")) };
    try {
      const { error } = creating ? await supabase.auth.signUp(credentials) : await supabase.auth.signInWithPassword(credentials);
      if (error) setAuthError(error.message);
    } catch (error) { setAuthError(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(false); }
  }

  async function log(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!owner) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true);
    setError("");
    try {
      const { error } = await supabase.from("entries").insert({ date, word_count: Number(values.get("words")), description: String(values.get("note")).trim() || null });
      if (user.current !== owner) return;
      if (error) { setError(error.message); return; }
      form.reset();
      await loadEntries(owner);
    } catch (error) { setError(error instanceof Error ? error.message : String(error)); }
    finally { setBusy(false); }
  }

  const numbers = stats(entries, today || "1970-01-01");
  return (
    <main className="mx-auto max-w-[640px] px-5 py-6 sm:py-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Ascalon</h1>
        {session && <div className="flex min-w-0 items-center gap-3 text-xs"><span className="truncate text-neutral-500 dark:text-neutral-400">{session.user.email}</span><button data-testid="sign-out" className="shrink-0" onClick={async () => { const { error } = await supabase.auth.signOut(); if (error) setError(error.message); }}>Sign out</button></div>}
      </header>
      {!ready ? <div role="status" className="text-sm text-neutral-500">Loading…</div> : !session ? (
        <form data-testid="auth-form" onSubmit={authenticate} className="mx-auto mt-16 max-w-sm space-y-5">
          <h2 className="text-lg font-medium">{creating ? "Create account" : "Sign in"}</h2>
          <label className="block space-y-2 text-sm"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
          <label className="block space-y-2 text-sm"><span>Password</span><input name="password" type="password" autoComplete={creating ? "new-password" : "current-password"} required /></label>
          {authError && <p data-testid="auth-error" role="alert" className="text-sm">{authError}</p>}
          <button disabled={busy} className={`${primary} w-full`}>{creating ? "Create account" : "Sign in"}</button>
          <button type="button" className="block text-sm underline underline-offset-4" onClick={() => { setCreating(!creating); setAuthError(""); }}>{creating ? "Sign in" : "Create account"}</button>
        </form>
      ) : (
        <div className="space-y-8">
          <form data-testid="log-form" onSubmit={log} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5 text-sm"><span className="block">Date</span><input name="date" type="date" value={date} max={today} onChange={event => setDate(event.target.value)} required /></label>
              <label className="space-y-1.5 text-sm"><span className="block">Word count</span><input name="words" type="number" min="1" max="2147483647" step="1" required /></label>
            </div>
            <div className="flex items-end gap-3"><label className="min-w-0 flex-1 space-y-1.5 text-sm"><span className="block">Note</span><input name="note" type="text" /></label><button disabled={busy} className={`${primary} h-[42px]`}>Log</button></div>
          </form>
          {error && <p role="alert" className="text-sm">{error}</p>}
          <section aria-label="Writing stats" className="grid grid-cols-2 gap-x-8 gap-y-5">
            {([['total', 'Total words'], ['days', 'Writing days'], ['current', 'Current streak'], ['longest', 'Longest streak']] as const).map(([key, label]) => <div key={key}><p data-testid={`stat-${key}`} className="text-2xl font-semibold tracking-tight tabular-nums">{numbers[key].toLocaleString("en-US")}</p><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{label}</p></div>)}
          </section>
          <Heatmap entries={entries} today={today} />
          <History entries={entries} />
        </div>
      )}
    </main>
  );
}
