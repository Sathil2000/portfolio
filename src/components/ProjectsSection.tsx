import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp, Project } from '@/contexts/AppContext';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/projects/${project.id}`} className="block">
        <div className="glass-card-hover p-6 md:p-8 group relative overflow-hidden cursor-pointer">
          <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-1/2 h-px bg-gradient-to-r ${isEven ? 'from-primary/30 to-transparent' : 'from-transparent to-accent/30'}`} />

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {project.image && (
              <div className="md:w-48 shrink-0 overflow-hidden rounded-xl border border-border/40 aspect-[4/3]">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            )}
            <div className="flex flex-col gap-1 md:w-32 shrink-0">
              <span className="font-mono text-xs text-primary/70">{project.year}</span>
              <span className="font-body text-xs text-muted-foreground">{project.category}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {project.title}
                <span className="inline-block ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="px-3 py-1 font-mono text-[11px] bg-muted text-muted-foreground rounded-lg border border-border/50">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { state } = useApp();
  return (
    <div className="space-y-5 max-w-4xl">
      {state.projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}
