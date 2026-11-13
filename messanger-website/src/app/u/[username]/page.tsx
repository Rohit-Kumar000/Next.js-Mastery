'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, MessageCircle, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function PublicMessagePage() {
  const { username } = useParams<{ username: string }>();
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [sending, setSending] = useState(false);
  const seenSuggestions = useRef<string[]>([]);
  const [profileStatus, setProfileStatus] = useState<'loading' | 'open' | 'closed' | 'missing' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    fetch(`/api/public-profile/${encodeURIComponent(username)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(response.status === 404 ? 'missing' : 'error');
        if (active) setProfileStatus(data.isAcceptingMessages ? 'open' : 'closed');
      })
      .catch((error: unknown) => {
        if (active) setProfileStatus(error instanceof Error && error.message === 'missing' ? 'missing' : 'error');
      });
    return () => { active = false; };
  }, [username]);

  async function loadSuggestions() {
    setLoadingSuggestions(true);
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exclude: seenSuggestions.current.slice(-12) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Suggestions are unavailable.');
      const fresh: string[] = data.suggestions ?? [];
      setSuggestions(fresh);
      seenSuggestions.current = [...seenSuggestions.current, ...fresh].slice(-12);
      if (data.fallback) {
        toast('Gemini is busy right now; showing built-in suggestions.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Suggestions are unavailable.');
    } finally {
      setLoadingSuggestions(false);
    }
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = content.trim();
    if (message.length < 10 || message.length > 300) {
      toast.error('Your message must be between 10 and 300 characters.');
      return;
    }
    setSending(true);
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content: message }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403) setProfileStatus('closed');
        throw new Error(data.message || 'Unable to send your message.');
      }
      setContent('');
      toast.success('Your anonymous message was sent.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send your message.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex-1 bg-slate-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-violet-700"><MessageCircle /></div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 sm:text-sm">Messanger · Anonymous inbox</p>
          <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Send a message to @{username}</h1>
          <p className="mt-2 text-slate-600">Your identity stays private. Keep it kind and thoughtful.</p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8">
          {profileStatus === 'loading' ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-violet-700" /></div>
          ) : profileStatus === 'closed' ? (
            <div className="rounded-2xl bg-amber-50 p-5 text-center text-amber-900">This user is not accepting messages right now.</div>
          ) : profileStatus === 'missing' ? (
            <div className="rounded-2xl bg-slate-100 p-5 text-center text-slate-700">This profile could not be found.</div>
          ) : profileStatus === 'error' ? (
            <div className="rounded-2xl bg-rose-50 p-5 text-center text-rose-800">Unable to load this profile. Please refresh and try again.</div>
          ) : (
            <>
              <form onSubmit={submitMessage}>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-800">Your message</label>
                <textarea id="message" value={content} onChange={(event) => setContent(event.target.value)} maxLength={300} minLength={10} required rows={6} placeholder="Write something nice…" className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" />
                <div className="mt-2 flex justify-between text-xs text-slate-500"><span>10–300 characters</span><span>{content.length}/300</span></div>
                <Button className="mt-5 w-full rounded-xl" type="submit" disabled={sending || content.trim().length < 10}>
                  {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Send anonymously
                </Button>
              </form>
              <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-medium uppercase tracking-wider text-slate-400">Need an idea?</span><div className="h-px flex-1 bg-slate-200" /></div>
              <Button variant="outline" className="w-full rounded-xl" onClick={loadSuggestions} disabled={loadingSuggestions}>
                {loadingSuggestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-violet-600" />}Suggest messages
              </Button>
              {suggestions.length > 0 && <div className="mt-4 space-y-2" aria-live="polite">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setContent(suggestion)} className="w-full rounded-xl border border-violet-100 bg-violet-50/70 p-3 text-left text-sm leading-relaxed text-slate-700 transition hover:border-violet-300 hover:bg-violet-50">{suggestion}</button>)}</div>}
              <p className="mt-5 text-center text-xs text-slate-400">Messages are only delivered while this inbox is open.</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
