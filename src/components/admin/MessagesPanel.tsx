import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Trash2, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: number;
  read: boolean;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();

    // Real-time: new messages appear instantly without refresh
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const markRead = async (id: string) => {
    await supabase.from('messages').update({ read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const clearAll = async () => {
    if (!confirm('Delete all messages?')) return;
    await supabase.from('messages').delete().neq('id', '');
    setMessages([]);
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Inbox</h3>
          <p className="font-body text-xs text-muted-foreground mt-1">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'} from the contact form
            {unread > 0 && <span className="ml-2 text-primary font-medium">· {unread} unread</span>}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchMessages}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {messages.length > 0 && (
            <button
              onClick={clearAll}
              className="font-body text-xs text-destructive/70 hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center">
          <RefreshCw className="w-6 h-6 mx-auto text-muted-foreground/40 mb-3 animate-spin" />
          <p className="font-body text-sm text-muted-foreground">Loading messages…</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Mail className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-body text-sm text-muted-foreground">No messages yet.</p>
          <p className="font-body text-xs text-muted-foreground/70 mt-1">
            When visitors submit the contact form, their messages appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <article
              key={m.id}
              onClick={() => !m.read && markRead(m.id)}
              className={`glass-card p-5 cursor-pointer transition-all ${m.read ? '' : 'border-l-4 border-l-primary'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-semibold text-foreground">{m.name}</h4>
                    {!m.read && (
                      <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    onClick={e => e.stopPropagation()}
                    className="font-body text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[10px] text-muted-foreground/70">{timeAgo(m.created_at)}</span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteMessage(m.id); }}
                    className="text-destructive/60 hover:text-destructive transition-colors"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {m.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
