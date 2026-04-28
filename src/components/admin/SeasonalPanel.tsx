import { useState } from 'react';
import { useApp, useAppRaw } from '@/contexts/AppContext';

export default function SeasonalPanel() {
  const state = useAppRaw(); const { dispatch } = useApp();
  const [newGreeting, setNewGreeting] = useState({ name: '', message: '', animationType: 'snowfall' as const, stickerUrl: '', themeColor: '#2d8a9e' });
  const inputClass = "w-full bg-card border border-border focus:border-primary/40 rounded-xl px-5 py-3 font-body text-sm text-foreground outline-none transition-all duration-300";
  const labelClass = "font-body text-xs text-muted-foreground block mb-2";

  const effectOptions = [
    { value: 'snowfall', label: 'snow', emoji: '❄️' },
    { value: 'fireworks', label: 'fireworks', emoji: '🎆' },
    { value: 'halloween', label: 'spiders', emoji: '🕷️' },
    { value: 'rain', label: 'rain', emoji: '🌧️' },
    { value: 'confetti', label: 'confetti', emoji: '🎊' },
    { value: 'hearts', label: 'hearts', emoji: '💖' },
    { value: 'none', label: 'none', emoji: '✕' },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">Manage Greetings</h3>
        <div className="space-y-4">
          {state.seasonalGreetings.map(sg => (
            <div key={sg.id} className="flex items-center justify-between p-5 bg-muted/50 rounded-xl border border-border/30">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display text-sm font-medium text-foreground">{sg.name}</span>
                  <span className={`font-body text-[11px] px-2.5 py-0.5 rounded-full ${sg.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {sg.active ? 'Active' : 'Inactive'}
                  </span>
                  {sg.themeColor && <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: sg.themeColor }} />}
                </div>
                <p className="font-body text-sm text-muted-foreground">{sg.message}</p>
                <p className="font-body text-xs text-muted-foreground/60 mt-1">Effect: {sg.animationType}{sg.stickerUrl ? ' • Has sticker' : ''}</p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <button onClick={() => dispatch({ type: 'TOGGLE_SEASONAL', payload: sg.id })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${sg.active ? 'bg-primary/25' : 'bg-muted'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${sg.active ? 'right-1 bg-primary' : 'left-1 bg-muted-foreground/40'}`} />
                </button>
                <button onClick={() => dispatch({ type: 'REMOVE_SEASONAL', payload: sg.id })} className="font-body text-xs text-destructive/60 hover:text-destructive transition-colors">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">New Season</h3>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Season Name</label>
            <input value={newGreeting.name} onChange={e => setNewGreeting({...newGreeting, name: e.target.value})} className={inputClass} placeholder="e.g. Valentine's Day" />
          </div>
          <div>
            <label className={labelClass}>Effect</label>
            <div className="flex flex-wrap gap-2">
              {effectOptions.map(opt => (
                <button key={opt.value} onClick={() => setNewGreeting({...newGreeting, animationType: opt.value as any})}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all text-sm ${newGreeting.animationType === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/30'}`}>
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="font-body text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Message (optional)</label>
            <textarea value={newGreeting.message} onChange={e => setNewGreeting({...newGreeting, message: e.target.value})} rows={3} className={inputClass + ' resize-none'} placeholder="Your celebration message..." />
          </div>
          <div>
            <label className={labelClass}>Sticker Image URL (optional — no-bg image)</label>
            <input value={newGreeting.stickerUrl} onChange={e => setNewGreeting({...newGreeting, stickerUrl: e.target.value})} className={inputClass} placeholder="https://..." />
            {newGreeting.stickerUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img src={newGreeting.stickerUrl} alt="preview" className="w-12 h-12 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                <span className="font-body text-xs text-muted-foreground">Preview</span>
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Theme Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={newGreeting.themeColor} onChange={e => setNewGreeting({...newGreeting, themeColor: e.target.value})} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
              <span className="font-mono text-sm text-muted-foreground">{newGreeting.themeColor}</span>
            </div>
          </div>
        </div>
        <button onClick={() => {
          if (!newGreeting.name) return;
          dispatch({ type: 'ADD_SEASONAL', payload: { id: Date.now().toString(), name: newGreeting.name, message: newGreeting.message, animationType: newGreeting.animationType, stickerUrl: newGreeting.stickerUrl || undefined, themeColor: newGreeting.themeColor, active: false } });
          setNewGreeting({ name: '', message: '', animationType: 'snowfall', stickerUrl: '', themeColor: '#2d8a9e' });
        }} className="mt-6 px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-body text-sm font-medium hover:bg-primary/20 transition-all flex items-center gap-2">
          🎄 Create Season
        </button>
      </div>
    </div>
  );
}
