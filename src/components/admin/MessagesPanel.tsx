import { useApp, useAppRaw } from '@/contexts/AppContext';
import { Mail, Trash2 } from 'lucide-react';

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function MessagesPanel() {
  const state = useAppRaw(); const { dispatch } = useApp();
  const messages = state.messages;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Inbox</h3>
          <p className="font-body text-xs text-muted-foreground mt-1">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'} from the contact form
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => { if (confirm('Delete all messages?')) dispatch({ type: 'CLEAR_MESSAGES' }); }}
            className="font-body text-xs text-destructive/70 hover:text-destructive transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Mail className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-body text-sm text-muted-foreground">No messages yet.</p>
          <p className="font-body text-xs text-muted-foreground/70 mt-1">When visitors submit the contact form, their messages appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <article
              key={m.id}
              onClick={() => !m.read && dispatch({ type: 'MARK_MESSAGE_READ', payload: m.id })}
              className={`glass-card p-5 cursor-pointer transition-all ${m.read ? '' : 'border-l-4 border-l-primary'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-semibold text-foreground">{m.name}</h4>
                    {!m.read && <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">New</span>}
                  </div>
                  <a href={`mailto:${m.email}`} className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                    {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[10px] text-muted-foreground/70">{timeAgo(m.createdAt)}</span>
                  <button
                    onClick={e => { e.stopPropagation(); if (confirm('Delete this message?')) dispatch({ type: 'REMOVE_MESSAGE', payload: m.id }); }}
                    className="text-destructive/60 hover:text-destructive transition-colors"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
