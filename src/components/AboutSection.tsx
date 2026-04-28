import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

export default function AboutSection() {
  const { state } = useApp();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="relative py-28">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-2xl"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-primary/70 mb-3">ABOUT ME</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Who I Am
          </h2>
          <p className="font-body text-base text-muted-foreground leading-relaxed">
            {state.aboutBio}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Skills</h3>
            <div className="space-y-5">
              {state.skills.map((skill, i) => (
                <div key={skill.id}>
                  <div className="flex justify-between mb-2">
                    <span className="font-body text-sm text-foreground/70">{skill.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Experience</h3>
            <div className="space-y-6">
              {state.experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                  className="glass-card p-5 relative pl-7"
                >
                  <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary to-accent rounded-full" />
                  <span className="font-mono text-xs text-primary/70">{exp.year}</span>
                  <h4 className="font-display text-base font-semibold text-foreground mt-1">{exp.role}</h4>
                  <p className="font-body text-sm text-muted-foreground">{exp.company}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
