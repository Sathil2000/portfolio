import { useApp } from '@/contexts/AppContext';

export default function Footer() {
  const { state } = useApp();
  const links = [
    { label: 'GitHub', url: state.socials?.github },
    { label: 'LinkedIn', url: state.socials?.linkedin },
    { label: 'Twitter', url: state.socials?.twitter },
  ].filter(l => l.url && l.url.trim().length > 0);

  return (
    <footer className="relative border-t border-border/40 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <span className="font-display text-sm font-semibold text-foreground/80">Portfolio</span>
          </div>

          <div className="flex items-center gap-8">
            {links.length === 0 && (
              <span className="font-body text-xs text-muted-foreground/60">Add socials in admin → About</span>
            )}
            {links.map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="font-body text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
