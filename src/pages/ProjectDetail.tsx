import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp, ContentBlock } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SeasonalOverlay from '@/components/SeasonalOverlay';
import Lightbox from '@/components/Lightbox';

function Block({ block, onOpen }: { block: ContentBlock; onOpen: (src: string, alt?: string) => void }) {
  const align = block.align === 'center' ? 'text-center' : block.align === 'right' ? 'text-right' : 'text-left';
  switch (block.type) {
    case 'heading':
      return <h2 className={`font-display text-3xl md:text-4xl font-bold text-foreground mb-6 mt-12 ${align}`}>{block.content}</h2>;
    case 'paragraph':
      return <p className={`font-body text-base md:text-lg text-foreground/75 leading-relaxed mb-6 ${align}`}>{block.content}</p>;
    case 'image':
      return (
        <figure className="my-10">
          <button
            type="button"
            onClick={() => block.content && onOpen(block.content, block.caption)}
            className="block w-full overflow-hidden rounded-2xl border border-border/60 shadow-[0_8px_32px_hsl(220_30%_80%_/_0.2)] cursor-zoom-in group"
          >
            <img src={block.content} alt={block.caption || ''} className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500" />
          </button>
          {block.caption && <figcaption className="font-body text-xs text-muted-foreground text-center mt-3 italic">{block.caption}</figcaption>}
        </figure>
      );
    case 'quote':
      return (
        <blockquote className="my-10 pl-6 border-l-2 border-primary">
          <p className="font-display text-xl md:text-2xl font-medium text-foreground/80 italic leading-relaxed">"{block.content}"</p>
        </blockquote>
      );
    case 'gallery':
      return (
        <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(block.images || []).map((src, i) => (
            <motion.button
              type="button"
              key={i}
              onClick={() => src && onOpen(src)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="overflow-hidden rounded-xl border border-border/60 aspect-square cursor-zoom-in group"
            >
              <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </motion.button>
          ))}
        </div>
      );
    case 'chart':
      return (
        <figure className="my-10">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card p-4">
            {block.content ? (
              <button type="button" onClick={() => onOpen(block.content!, block.caption)} className="block w-full cursor-zoom-in">
                <img src={block.content} alt={block.caption || 'chart'} className="w-full h-auto" />
              </button>
            ) : (
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm">Chart placeholder</div>
            )}
          </div>
          {block.caption && <figcaption className="font-body text-xs text-muted-foreground text-center mt-3 italic">{block.caption}</figcaption>}
        </figure>
      );
    case 'divider':
      return <div className="my-12 h-px bg-gradient-to-r from-transparent via-border to-transparent" />;
    default:
      return null;
  }
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { state } = useApp();
  const project = state.projects.find(p => p.id === id);
  const [lightbox, setLightbox] = useState<{ src: string; alt?: string } | null>(null);
  const open = (src: string, alt?: string) => setLightbox({ src, alt });

  if (!project) return <Navigate to="/projects" replace />;

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <SeasonalOverlay />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {project.image && (
          <div className="absolute inset-0 -z-10">
            <img src={project.image} alt="" className="w-full h-full object-cover opacity-30" style={{ filter: 'blur(8px)' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
          </div>
        )}
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/projects" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-8">
              ← All projects
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-primary/70">{project.year}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="font-mono text-xs text-muted-foreground">{project.category}</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[1.05]">
              {project.title}
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map(t => (
                <span key={t} className="px-3 py-1 font-mono text-[11px] bg-card text-foreground/70 rounded-lg border border-border/60">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover image */}
      {project.image && (
        <div className="container mx-auto px-6 md:px-12 max-w-5xl mb-8">
          <motion.button
            type="button"
            onClick={() => open(project.image!, project.title)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block w-full overflow-hidden rounded-3xl border border-border/60 shadow-[0_20px_60px_hsl(220_30%_70%_/_0.25)] cursor-zoom-in group"
          >
            <img src={project.image} alt={project.title} className="w-full h-auto aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-700" />
          </motion.button>
        </div>
      )}

      {/* Body blocks */}
      <article className="container mx-auto px-6 md:px-12 max-w-3xl py-16">
        {(project.blocks || []).map((block, i) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.3) }}
          >
            <Block block={block} onOpen={open} />
          </motion.div>
        ))}

        {(!project.blocks || project.blocks.length === 0) && (
          <p className="font-body text-muted-foreground italic text-center py-12">No content yet — add blocks from the admin panel.</p>
        )}
      </article>

      <Lightbox src={lightbox?.src || null} alt={lightbox?.alt} onClose={() => setLightbox(null)} />

      <Footer />
    </div>
  );
}
