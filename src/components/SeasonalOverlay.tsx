import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

function Snowfall() {
  const flakes = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {flakes.map(f => (
        <div
          key={f.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animation: `snowfall ${f.duration}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function HalloweenSpiders() {
  const spiders = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      delay: Math.random() * 4,
      threadLength: 40 + Math.random() * 80,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {spiders.map(s => (
        <div
          key={s.id}
          className="absolute top-0"
          style={{
            left: `${s.left}%`,
            animation: `spider-drop 2.5s ease-in-out ${s.delay}s forwards`,
          }}
        >
          <div className="w-px bg-foreground/15 mx-auto" style={{ height: s.threadLength }} />
          <div className="text-2xl">🕷️</div>
        </div>
      ))}
    </div>
  );
}

function Fireworks() {
  const bursts = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 40,
      delay: Math.random() * 3,
      size: 60 + Math.random() * 80,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {bursts.map(b => (
        <div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            animation: `firework-burst 1.5s ease-out ${b.delay}s infinite`,
          }}
        >
          {[...Array(8)].map((_, j) => (
            <div
              key={j}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{
                left: '50%',
                top: '50%',
                animation: `firework-particle 1.5s ease-out ${b.delay}s infinite`,
                transform: `rotate(${j * 45}deg) translateY(-${b.size / 2.5}px)`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Hearts() {
  const hearts = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 12 + Math.random() * 16,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute bottom-0"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animation: `hearts-rise ${h.duration}s ease-out ${h.delay}s infinite`,
          }}
        >
          💖
        </div>
      ))}
    </div>
  );
}

function Rain() {
  const drops = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {drops.map(d => (
        <div
          key={d.id}
          className="absolute w-px h-4 bg-blue-400/40"
          style={{
            left: `${d.left}%`,
            animation: `rain-fall ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      color: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bcb', '#a66cff'][Math.floor(Math.random() * 6)],
      rotation: Math.random() * 360,
      size: 4 + Math.random() * 6,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            backgroundColor: p.color,
            borderRadius: 1,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const animationComponents: Record<string, React.FC> = {
  snowfall: Snowfall,
  halloween: HalloweenSpiders,
  fireworks: Fireworks,
  hearts: Hearts,
  rain: Rain,
  confetti: Confetti,
};

export default function SeasonalOverlay() {
  const { state } = useApp();
  const active = state.seasonalGreetings.filter(s => s.active);
  const [shownIds, setShownIds] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  // Show only once per page load — track via sessionStorage key per refresh
  const sessionKey = 'seasonal-shown-' + active.map(s => s.id).join(',');

  useEffect(() => {
    if (active.length === 0) return;
    const alreadyShown = sessionStorage.getItem(sessionKey);
    if (!alreadyShown) {
      setShownIds(active.map(s => s.id));
      setDismissed(false);
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, [sessionKey, active.length]);

  if (active.length === 0 || shownIds.length === 0) return null;

  const currentSeason = active[0]; // Show first active
  const AnimComponent = animationComponents[currentSeason.animationType];

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <>
      {/* Animation layer — only show while not dismissed */}
      <AnimatePresence>
        {!dismissed && AnimComponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimComponent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal overlay — centered with blur bg */}
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex items-center justify-center"
          >
            {/* Blurred backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleDismiss}
            />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
              style={currentSeason.themeColor ? {
                borderColor: currentSeason.themeColor + '40',
                boxShadow: `0 20px 60px ${currentSeason.themeColor}20`,
              } : {}}
            >
              {/* Sticker */}
              {currentSeason.stickerUrl && (
                <div className="flex justify-center pt-6 -mb-2">
                  <img
                    src={currentSeason.stickerUrl}
                    alt="seasonal sticker"
                    className="w-24 h-24 object-contain drop-shadow-lg"
                  />
                </div>
              )}

              <div className="p-6 pt-4 text-center">
                <h3
                  className="font-display text-xl font-bold mb-2"
                  style={currentSeason.themeColor ? { color: currentSeason.themeColor } : {}}
                >
                  {currentSeason.name}
                </h3>

                {currentSeason.message && (
                  <p className="font-body text-sm text-muted-foreground mb-5">
                    {currentSeason.message}
                  </p>
                )}

                <button
                  onClick={handleDismiss}
                  className="px-6 py-2.5 rounded-xl font-body text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{
                    backgroundColor: currentSeason.themeColor || 'hsl(var(--primary))',
                  }}
                >
                  Let's Go! 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
