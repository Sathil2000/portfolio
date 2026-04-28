import { useApp } from '@/contexts/AppContext';

export default function TestimonialsMarquee() {
  const { state } = useApp();
  const doubled = [...state.testimonials, ...state.testimonials];

  if (state.testimonials.length === 0) return null;

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 mb-10">
        <p className="font-mono text-xs tracking-[0.2em] text-primary/70 mb-3">TESTIMONIALS</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          What People Say
        </h2>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex" style={{ animation: 'marquee 40s linear infinite' }}>
          {doubled.map((t, i) => (
            <div key={i} className="flex-shrink-0 w-80 glass-card p-6 mx-3">
              <p className="font-body text-sm text-foreground/70 leading-relaxed mb-4 italic">"{t.text}"</p>
              <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
              <p className="font-body text-xs text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
