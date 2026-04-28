import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import character2 from '@/assets/character-2.png';

export default function ContactSection() {
  const { state, dispatch } = useApp();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || name.length > 100) return setError('Please enter a valid name (max 100 chars).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return setError('Please enter a valid email.');
    if (!message || message.length > 1000) return setError('Message must be 1–1000 characters.');
    dispatch({
      type: 'ADD_MESSAGE',
      payload: { id: Date.now().toString(), name, email, message, createdAt: Date.now(), read: false },
    });
    setForm({ name: '', email: '', message: '' });
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" ref={ref} className="relative py-28 overflow-hidden">
      {/* Character integrated into the composition */}
      <div className="absolute left-0 md:left-10 top-0 bottom-0 z-0 pointer-events-none flex items-end">
        <motion.img
          src={character2}
          alt=""
          className="w-36 md:w-56 object-contain character-blend opacity-60"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 0.6, y: 0 } : {}}
          transition={{ duration: 1.5 }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl ml-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <p className="font-mono text-xs tracking-[0.2em] text-primary/70 mb-3">GET IN TOUCH</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Let's Talk
            </h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              {state.contactMessage}
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form className="space-y-5" onSubmit={submit}>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs text-muted-foreground tracking-wide block mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                    placeholder="Your name"
                    className="w-full bg-card border border-border focus:border-primary/40 rounded-xl px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:shadow-[0_0_20px_hsl(var(--primary)/0.06)]"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground tracking-wide block mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    maxLength={255}
                    placeholder="your@email.com"
                    className="w-full bg-card border border-border focus:border-primary/40 rounded-xl px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:shadow-[0_0_20px_hsl(var(--primary)/0.06)]"
                  />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground tracking-wide block mb-2">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  maxLength={1000}
                  placeholder="Tell me about your project..."
                  className="w-full bg-card border border-border focus:border-primary/40 rounded-xl px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 resize-none focus:shadow-[0_0_20px_hsl(var(--primary)/0.06)]"
                />
              </div>
              {error && <p className="font-body text-xs text-destructive">{error}</p>}
              {sent && <p className="font-body text-xs text-primary">Message received — thanks for reaching out!</p>}
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wide hover:brightness-110 transition-all duration-300 shadow-[0_4px_20px_hsl(var(--primary)/0.15)]"
              >
                Send Message →
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
