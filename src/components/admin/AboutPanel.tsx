import { useState } from 'react';
import { useApp, useAppRaw } from '@/contexts/AppContext';

export default function AboutPanel() {
  const state = useAppRaw(); const { dispatch } = useApp();
  const [bio, setBio] = useState(state.aboutBio);
  const [newSkill, setNewSkill] = useState({ name: '', level: 70 });
  const [newExp, setNewExp] = useState({ year: '', role: '', company: '' });
  const [newTest, setNewTest] = useState({ name: '', role: '', text: '' });
  const [socials, setSocials] = useState({
    github: state.socials?.github || '',
    linkedin: state.socials?.linkedin || '',
    twitter: state.socials?.twitter || '',
  });

  const inputClass = "w-full bg-card border border-border focus:border-primary/40 rounded-xl px-5 py-3 font-body text-sm text-foreground outline-none transition-all duration-300";
  const labelClass = "font-body text-xs text-muted-foreground block mb-2";
  const btnClass = "px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-body text-sm font-medium hover:bg-primary/20 transition-all";
  const subBtn = "px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-xs font-medium hover:brightness-110 transition-all";

  const toggleFeatured = (id: string) => {
    const set = new Set(state.featuredProjectIds);
    if (set.has(id)) set.delete(id); else set.add(id);
    dispatch({ type: 'SET_FEATURED', payload: Array.from(set) });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Bio */}
      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">About / Bio</h3>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className={inputClass + ' resize-none'} />
        <button onClick={() => dispatch({ type: 'UPDATE_ABOUT', payload: { aboutBio: bio } })} className={btnClass + ' mt-4'}>Save Bio</button>
      </div>

      {/* Social links */}
      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">Social Links</h3>
        <p className="font-body text-xs text-muted-foreground mb-5">Used in the site footer. Leave blank to hide a link.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input value={socials.github} onChange={e => setSocials({ ...socials, github: e.target.value })} className={inputClass} placeholder="https://github.com/username" />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input value={socials.linkedin} onChange={e => setSocials({ ...socials, linkedin: e.target.value })} className={inputClass} placeholder="https://linkedin.com/in/username" />
          </div>
          <div>
            <label className={labelClass}>Twitter / X URL</label>
            <input value={socials.twitter} onChange={e => setSocials({ ...socials, twitter: e.target.value })} className={inputClass} placeholder="https://twitter.com/username" />
          </div>
        </div>
        <button
          onClick={() => {
            const valid = (u: string) => !u || /^https?:\/\//i.test(u.trim());
            if (!valid(socials.github) || !valid(socials.linkedin) || !valid(socials.twitter)) {
              alert('URLs must start with http:// or https://');
              return;
            }
            dispatch({ type: 'UPDATE_SOCIALS', payload: {
              github: socials.github.trim(),
              linkedin: socials.linkedin.trim(),
              twitter: socials.twitter.trim(),
            }});
          }}
          className={btnClass + ' mt-5'}
        >
          Save Socials
        </button>
      </div>

      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">Skills</h3>
        <div className="space-y-3 mb-6">
          {state.skills.map(s => (
            <div key={s.id} className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl">
              <span className="font-body text-sm text-foreground flex-1">{s.name}</span>
              <span className="font-mono text-xs text-muted-foreground w-12 text-right">{s.level}%</span>
              <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${s.level}%` }} /></div>
              <button onClick={() => dispatch({ type: 'REMOVE_SKILL', payload: s.id })} className="text-destructive/60 hover:text-destructive text-xs">×</button>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <div><label className={labelClass}>Skill name</label><input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} className={inputClass} placeholder="e.g. Figma" /></div>
          <div><label className={labelClass}>Level</label><input type="number" min={0} max={100} value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: +e.target.value })} className={inputClass + ' w-24'} /></div>
          <button onClick={() => { if (!newSkill.name) return; dispatch({ type: 'ADD_SKILL', payload: { id: Date.now().toString(), name: newSkill.name, level: newSkill.level } }); setNewSkill({ name: '', level: 70 }); }} className={subBtn}>Add</button>
        </div>
      </div>

      {/* Experience */}
      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">Experience</h3>
        <div className="space-y-3 mb-6">
          {state.experiences.map(e => (
            <div key={e.id} className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl">
              <span className="font-mono text-xs text-primary/70 w-28">{e.year}</span>
              <span className="font-body text-sm text-foreground flex-1">{e.role}</span>
              <span className="font-body text-xs text-muted-foreground">{e.company}</span>
              <button onClick={() => dispatch({ type: 'REMOVE_EXPERIENCE', payload: e.id })} className="text-destructive/60 hover:text-destructive text-xs">×</button>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <input value={newExp.year} onChange={e => setNewExp({ ...newExp, year: e.target.value })} className={inputClass} placeholder="2026–Now" />
          <input value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} className={inputClass} placeholder="Role" />
          <input value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} className={inputClass} placeholder="Company" />
          <button onClick={() => { if (!newExp.role) return; dispatch({ type: 'ADD_EXPERIENCE', payload: { id: Date.now().toString(), ...newExp } }); setNewExp({ year: '', role: '', company: '' }); }} className={subBtn}>Add</button>
        </div>
      </div>

      {/* Testimonials */}
      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">Testimonials</h3>
        <div className="space-y-3 mb-6">
          {state.testimonials.map(t => (
            <div key={t.id} className="flex items-start gap-4 p-4 bg-muted/40 rounded-xl">
              <div className="flex-1">
                <p className="font-body text-sm text-foreground/80 italic mb-1">"{t.text}"</p>
                <p className="font-display text-xs font-semibold text-foreground">{t.name} <span className="font-body font-normal text-muted-foreground">— {t.role}</span></p>
              </div>
              <button onClick={() => dispatch({ type: 'REMOVE_TESTIMONIAL', payload: t.id })} className="text-destructive/60 hover:text-destructive text-xs">×</button>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input value={newTest.name} onChange={e => setNewTest({ ...newTest, name: e.target.value })} className={inputClass} placeholder="Name" />
            <input value={newTest.role} onChange={e => setNewTest({ ...newTest, role: e.target.value })} className={inputClass} placeholder="Role / Company" />
          </div>
          <textarea value={newTest.text} onChange={e => setNewTest({ ...newTest, text: e.target.value })} rows={2} className={inputClass + ' resize-none'} placeholder="Testimonial..." />
          <button onClick={() => { if (!newTest.name || !newTest.text) return; dispatch({ type: 'ADD_TESTIMONIAL', payload: { id: Date.now().toString(), ...newTest } }); setNewTest({ name: '', role: '', text: '' }); }} className={subBtn}>Add Testimonial</button>
        </div>
      </div>

      {/* Featured projects */}
      <div className="glass-card p-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">Featured on Landing</h3>
        <p className="font-body text-xs text-muted-foreground mb-5">Pick which projects appear in the bento grid on the homepage.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {state.projects.map(p => {
            const isFeatured = state.featuredProjectIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleFeatured(p.id)}
                className={`text-left p-4 rounded-xl border transition-all ${isFeatured ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-sm font-medium text-foreground">{p.title}</span>
                  <div className={`w-4 h-4 rounded-full border ${isFeatured ? 'bg-primary border-primary' : 'border-border'}`}>
                    {isFeatured && <div className="w-full h-full rounded-full flex items-center justify-center text-primary-foreground text-[10px]">✓</div>}
                  </div>
                </div>
                <p className="font-body text-xs text-muted-foreground">{p.category} · {p.year}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
