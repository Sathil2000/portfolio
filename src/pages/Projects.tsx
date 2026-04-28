import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SeasonalOverlay from '@/components/SeasonalOverlay';
import { useApp } from '@/contexts/AppContext';
import { HoverCard } from '@/components/FeaturedProjects';

const sizeMap: Record<string, string> = {
  lg: 'md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[520px]',
  md: 'md:col-span-2 min-h-[260px]',
  sm: 'min-h-[260px]',
};

export default function Projects() {
  const { state } = useApp();

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <SeasonalOverlay />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 max-w-xl"
          >
            <p className="font-mono text-xs tracking-[0.2em] text-primary/70 mb-3">SELECTED WORK</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Projects
            </h1>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              A curated collection of work spanning AI, infrastructure, cryptography, and creative technology.
            </p>
          </motion.div>

          {state.projects.length === 0 ? (
            <p className="font-body text-muted-foreground italic text-center py-20">
              No projects yet — add some from the admin dashboard.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[260px]">
              {state.projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={sizeMap[project.bentoSize || 'sm']}
                >
                  <HoverCard project={project} className="h-full w-full" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
