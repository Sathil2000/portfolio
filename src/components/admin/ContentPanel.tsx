import { useState } from 'react';
import { useApp, useAppRaw } from '@/contexts/AppContext';
import ImagePicker from './ImagePicker';
import { getHeroFilterCSS, HERO_FILTER_OPTIONS } from '@/lib/heroFilter';
import heroLandscape from '@/assets/hero-landscape.jpg';

export default function ContentPanel() {
  const state = useAppRaw(); const { dispatch } = useApp();
  const [heroTitle, setHeroTitle] = useState(state.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(state.heroSubtitle);
  const [heroTagline, setHeroTagline] = useState(state.heroTagline);
  const [contactMsg, setContactMsg] = useState(state.contactMessage);

  const inputClass = "w-full bg-card border border-border focus:border-primary/40 rounded-xl px-5 py-3 font-body text-sm text-foreground outline-none transition-all duration-300";
  const labelClass = "font-body text-xs text-muted-foreground block mb-2";
  const btnClass = "mt-5 px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-body text-sm font-medium hover:bg-primary/20 transition-all";

  const previewSrc = state.heroImage || heroLandscape;
  const previewFilter = getHeroFilterCSS(state.heroFilter);

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">Hero Section — Text</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className={labelClass}>Title</label><input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Tagline</label><input value={heroTagline} onChange={e => setHeroTagline(e.target.value)} className={inputClass} /></div>
          <div className="md:col-span-2"><label className={labelClass}>Subtitle</label><input value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className={inputClass} /></div>
        </div>
        <button onClick={() => dispatch({ type: 'UPDATE_HERO', payload: { heroTitle, heroSubtitle, heroTagline } })} className={btnClass}>Save Text</button>
      </div>

      {/* Hero image + filter */}
      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">Hero Image &amp; Filter</h3>
        <p className="font-body text-xs text-muted-foreground mb-5">
          Upload a custom hero background or use a URL. Apply a filter and tune its strength to make the mountainscape pop.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image picker */}
          <div>
            <label className={labelClass}>Background image (URL or upload)</label>
            <ImagePicker
              value={state.heroImage || ''}
              onChange={url => dispatch({ type: 'UPDATE_HERO', payload: { heroImage: url || undefined } })}
              placeholder="https://..."
              maxDimension={1920}
              quality={0.88}
            />
            {!state.heroImage && (
              <p className="font-body text-[11px] text-muted-foreground/80 mt-2">Using built-in landscape until you upload one.</p>
            )}
          </div>

          {/* Live preview */}
          <div>
            <label className={labelClass}>Live preview</label>
            <div className="relative rounded-xl overflow-hidden border border-border bg-muted aspect-[16/9]">
              <img src={previewSrc} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: previewFilter }} />
            </div>
          </div>
        </div>

        {/* Filter type */}
        <div className="mt-6">
          <label className={labelClass}>Filter type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {HERO_FILTER_OPTIONS.map(opt => {
              const active = state.heroFilter.type === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => dispatch({ type: 'UPDATE_HERO_FILTER', payload: { type: opt.id } })}
                  className={`text-left p-3 rounded-xl border transition-all ${active ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}
                >
                  <div className="font-display text-xs font-semibold text-foreground">{opt.label}</div>
                  <div className="font-body text-[10px] text-muted-foreground mt-0.5 leading-snug">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Strength */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass + ' mb-0'}>Filter strength</label>
            <span className="font-mono text-xs text-primary">{state.heroFilter.strength}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={state.heroFilter.strength}
            onChange={e => dispatch({ type: 'UPDATE_HERO_FILTER', payload: { strength: +e.target.value } })}
            className="w-full accent-primary"
            disabled={state.heroFilter.type === 'none'}
          />
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">Contact Section</h3>
        <label className={labelClass}>Message</label>
        <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)} rows={3} className={inputClass + ' resize-none'} />
        <button onClick={() => dispatch({ type: 'UPDATE_CONTACT', payload: { contactMessage: contactMsg } })} className={btnClass}>Save</button>
      </div>
    </div>
  );
}
