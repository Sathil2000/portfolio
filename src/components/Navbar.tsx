import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/super-admin');
  const isProjects = location.pathname === '/projects';

  const navLinks = [
    { label: 'Home', href: '/', isRoute: true },
    { label: 'Projects', href: '/projects', isRoute: true },
    { label: 'Contact', href: '/contact', isRoute: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/40">
      <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-display text-base font-semibold text-foreground tracking-wide">Portfolio</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {!isAdmin && navLinks.map(link => (
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className={`font-body text-sm transition-colors duration-300 ${
                  location.pathname === link.href ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            )
          ))}
          <Link
            to={isAdmin ? '/' : '/super-admin'}
            className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            {isAdmin ? '← Back' : 'Admin'}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-1">
          <span className={`w-5 h-px bg-foreground/60 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-5 h-px bg-foreground/60 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-foreground/60 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background/90 backdrop-blur-2xl"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {navLinks.map(link => (
                link.isRoute ? (
                  <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">
                    {link.label}
                  </a>
                )
              ))}
              <Link to={isAdmin ? '/' : '/super-admin'} onClick={() => setMenuOpen(false)} className="font-body text-sm text-primary">
                {isAdmin ? '← Back' : 'Admin'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
