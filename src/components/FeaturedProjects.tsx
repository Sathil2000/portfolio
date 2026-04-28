import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp, Project, HoverAnimation } from '@/contexts/AppContext';

const sizeMap: Record<string, string> = {
  lg: 'md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[520px]',
  md: 'md:col-span-2 min-h-[260px]',
  sm: 'min-h-[260px]',
};

function CardInner({ project, large }: { project: Project; large: boolean }) {
  return (
    <>
      {project.image ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/15 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-card to-accent/10" />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-7">
        <div className="flex items-center justify-between">
          <span className={`font-mono text-[11px] tracking-wider px-3 py-1 rounded-full backdrop-blur-md border ${project.image ? 'text-background/90 bg-foreground/30 border-background/10' : 'text-primary bg-primary/10 border-primary/20'}`}>
            {project.category}
          </span>
          <span className={`font-mono text-[11px] ${project.image ? 'text-background/80' : 'text-muted-foreground'}`}>{project.year}</span>
        </div>

        <div>
          <h3 className={`font-display text-2xl md:text-3xl font-bold mb-2 leading-tight ${project.image ? 'text-background drop-shadow' : 'text-foreground'}`}>
            {project.title}
          </h3>
          {large && (
            <p className={`font-body text-sm leading-relaxed mb-4 max-w-md line-clamp-2 ${project.image ? 'text-background/90' : 'text-muted-foreground'}`}>
              {project.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map(t => (
              <span key={t} className={`font-mono text-[10px] px-2 py-0.5 rounded-md backdrop-blur-md border ${project.image ? 'text-background/90 bg-background/15 border-background/10' : 'text-foreground/70 bg-muted border-border'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function HoverCard({ project, className, disableAnimation }: { project: Project; className: string; disableAnimation?: boolean }) {
  const anim: HoverAnimation = disableAnimation ? 'lift' : (project.hoverAnimation || 'lift');
  const effectiveSize = disableAnimation ? (project.homeBentoSize || project.bentoSize) : project.bentoSize;
  const large = effectiveSize === 'lg';
  const tiltRef = useRef<HTMLAnchorElement>(null);

  const baseLink =
    'group relative block h-full w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_4px_24px_hsl(220_30%_80%_/_0.12)] transition-all duration-500';

  // ===== FLIP =====
  if (anim === 'flip') {
    const back = project.imageBack || project.image;
    return (
      <div className={className} style={{ perspective: 1200 }}>
        <Link to={`/projects/${project.id}`} className="block h-full w-full group [transform-style:preserve-3d] transition-transform duration-700 hover:[transform:rotateY(180deg)] relative">
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-border/60 overflow-hidden bg-card shadow-[0_4px_24px_hsl(220_30%_80%_/_0.12)]">
            <CardInner project={project} large={large} />
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-primary/30 overflow-hidden bg-card shadow-[0_4px_24px_hsl(220_30%_80%_/_0.12)]">
            {back ? (
              <>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${back})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-foreground/20" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-card to-accent/10" />
            )}
            <div className="relative z-10 h-full w-full p-6 md:p-7 flex flex-col justify-between">
              <div>
                <p className={`font-mono text-[11px] tracking-wider mb-3 ${back ? 'text-background/80' : 'text-primary/70'}`}>PROJECT</p>
                <h3 className={`font-display text-2xl md:text-3xl font-bold mb-3 ${back ? 'text-background drop-shadow' : 'text-foreground'}`}>{project.title}</h3>
                <p className={`font-body text-sm line-clamp-5 ${back ? 'text-background/90' : 'text-muted-foreground'}`}>{project.description}</p>
              </div>
              <span className={`font-mono text-xs inline-flex items-center gap-2 ${back ? 'text-background' : 'text-primary'}`}>View case study →</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // ===== TILT — direct DOM transform (no React state thrash) =====
  if (anim === 'tilt') {
    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const node = tiltRef.current;
      if (!node) return;
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      node.style.transform = `rotateX(${-y * 12}deg) rotateY(${x * 14}deg) translateZ(0)`;
    };
    const handleLeave = () => {
      const node = tiltRef.current;
      if (node) node.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    };
    return (
      <div
        className={className}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ perspective: 1000 }}
      >
        <Link
          ref={tiltRef}
          to={`/projects/${project.id}`}
          style={{ transformStyle: 'preserve-3d', transition: 'transform 0.18s ease-out', willChange: 'transform' }}
          className={baseLink + ' hover:shadow-[0_20px_50px_hsl(var(--primary)/0.18)]'}
        >
          <CardInner project={project} large={large} />
        </Link>
      </div>
    );
  }

  // ===== GLOW — explicit always-mounted halo so it actually shows =====
  if (anim === 'glow') {
    return (
      <div className={className + ' group/glow relative'}>
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 group-hover/glow:opacity-100 transition-opacity duration-500 blur-2xl"
          style={{ background: 'radial-gradient(60% 60% at 50% 50%, hsl(var(--primary) / 0.55), transparent 70%)' }}
        />
        <Link
          to={`/projects/${project.id}`}
          className={baseLink + ' group-hover/glow:border-primary/50 group-hover/glow:shadow-[0_0_60px_hsl(var(--primary)/0.4)]'}
        >
          <CardInner project={project} large={large} />
        </Link>
      </div>
    );
  }

  // ===== LIFT / ZOOM / SLIDE / NONE =====
  const variantClass: Record<HoverAnimation, string> = {
    lift: 'hover:shadow-[0_12px_48px_hsl(var(--primary)/0.18)] hover:-translate-y-1',
    zoom: 'hover:shadow-[0_8px_32px_hsl(var(--primary)/0.15)] [&_div.bg-cover]:group-hover:scale-125',
    slide: 'hover:shadow-[0_8px_32px_hsl(var(--primary)/0.12)]',
    none: '',
    flip: '',
    tilt: '',
    glow: '',
  };

  return (
    <div className={className}>
      <Link to={`/projects/${project.id}`} className={`${baseLink} ${variantClass[anim]}`}>
        <CardInner project={project} large={large} />
        {anim === 'slide' && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-primary/95 text-primary-foreground px-6 py-3 font-mono text-xs tracking-wider z-20">
            View case study →
          </div>
        )}
        <div className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
          <span className="text-foreground text-lg">↗</span>
        </div>
      </Link>
    </div>
  );
}

export default function FeaturedProjects() {
  const { state } = useApp();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const featured = state.featuredProjectIds
    .map(id => state.projects.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (featured.length === 0) return null;

  return (
    <section ref={ref} className="relative py-28">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="max-w-xl">
            <p className="font-mono text-xs tracking-[0.2em] text-primary/70 mb-3">FEATURED WORK</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Selected <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="font-body text-sm text-muted-foreground hover:text-primary transition-colors group inline-flex items-center gap-2 self-start md:self-end"
          >
            View all
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[260px]">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={sizeMap[project.homeBentoSize || project.bentoSize || 'sm']}
            >
              <HoverCard project={project} className="h-full w-full" disableAnimation />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
