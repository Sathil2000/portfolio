import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { getHeroFilterCSS } from '@/lib/heroFilter';
import heroLandscape from '@/assets/hero-landscape.jpg';
import character1 from '@/assets/character-1.png';

export default function HeroSection() {
  const { state } = useApp();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      parallaxRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroSrc = state.heroImage || heroLandscape;
  const filterCSS = getHeroFilterCSS(state.heroFilter);

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden pb-20">
      {/* Background landscape with parallax */}
      <div ref={parallaxRef} className="absolute inset-0 z-0">
        <img
          src={heroSrc}
          alt="Hero landscape"
          className="w-full h-full object-cover"
          style={{ filter: filterCSS }}
          width={1920}
          height={1080}
        />
        {/* Lighter overlays so the mountainscape stays sharp and vivid */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background/20 to-transparent" />
      </div>

      {/* Character floating in the scene */}
      <div className="absolute right-4 md:right-16 bottom-0 z-10 pointer-events-none">
        <motion.img
          src={character1}
          alt=""
          className="w-44 md:w-64 lg:w-72 object-contain character-blend"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2, ease: 'easeOut' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-mono text-xs tracking-[0.3em] text-primary/80 mb-6"
          >
            PORTFOLIO — 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            <span className="text-foreground">{state.heroTitle.split(' ')[0]} </span>
            <span className="gradient-text">{state.heroTitle.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="font-body text-lg md:text-xl text-foreground/60 leading-relaxed max-w-lg mb-4"
          >
            {state.heroSubtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="font-body text-sm text-muted-foreground tracking-wide"
          >
            {state.heroTagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="/projects"
              className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wide hover:brightness-110 transition-all duration-300 shadow-[0_4px_20px_hsl(var(--primary)/0.2)]"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-xl bg-card border border-border font-display text-sm font-semibold tracking-wide text-foreground/70 hover:text-foreground hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-foreground/15 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-primary/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
