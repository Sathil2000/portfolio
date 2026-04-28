import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp, useAppRaw, Project, ContentBlock, BlockType, ProjectTemplate, HoverAnimation } from '@/contexts/AppContext';
import ImagePicker from './ImagePicker';

const inputClass = "w-full bg-card border border-border focus:border-primary/40 rounded-xl px-4 py-2.5 font-body text-sm text-foreground outline-none transition-all duration-300";
const labelClass = "font-body text-xs text-muted-foreground block mb-1.5";
const btnPrimary = "px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-medium hover:brightness-110 transition-all";
const btnGhost = "px-4 py-2 rounded-xl bg-muted text-muted-foreground font-body text-xs hover:bg-primary/10 hover:text-primary transition-all";

const TEMPLATES: { id: ProjectTemplate; label: string; icon: string; desc: string; starter: ContentBlock[] }[] = [
  { id: 'longform', label: 'Hero + Long-form', icon: '📖', desc: 'Editorial case study with images and paragraphs.',
    starter: [
      { id: 'b1', type: 'paragraph', content: 'Open with a strong intro paragraph.' },
      { id: 'b2', type: 'image', content: '', caption: 'Caption' },
      { id: 'b3', type: 'heading', content: 'Section heading' },
      { id: 'b4', type: 'paragraph', content: 'Continue the story…' },
    ],
  },
  { id: 'gallery', label: 'Gallery-first', icon: '🖼️', desc: 'Image-heavy layout, minimal copy.',
    starter: [
      { id: 'b1', type: 'gallery', images: ['', '', ''] },
      { id: 'b2', type: 'paragraph', content: 'Short context paragraph.' },
    ],
  },
  { id: 'data', label: 'Data-driven', icon: '📊', desc: 'Charts and graphs with explanatory text.',
    starter: [
      { id: 'b1', type: 'paragraph', content: 'Set up the data story.' },
      { id: 'b2', type: 'chart', content: '', caption: 'Chart caption' },
      { id: 'b3', type: 'paragraph', content: 'Interpret the results.' },
    ],
  },
  { id: 'custom', label: 'Custom builder', icon: '🧩', desc: 'Start blank — add any block you want.', starter: [] },
];

const BLOCK_TYPES: { type: BlockType; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'paragraph', label: 'Text', icon: '¶' },
  { type: 'image', label: 'Image', icon: '🖼' },
  { type: 'gallery', label: 'Gallery', icon: '⊞' },
  { type: 'chart', label: 'Chart', icon: '📊' },
  { type: 'quote', label: 'Quote', icon: '❝' },
  { type: 'divider', label: 'Divider', icon: '—' },
];

const HOVER_ANIMATIONS: { id: HoverAnimation; label: string; desc: string }[] = [
  { id: 'lift', label: 'Lift', desc: 'Soft rise + shadow (default)' },
  { id: 'flip', label: 'Flip', desc: 'Card flips to reveal back' },
  { id: 'zoom', label: 'Zoom', desc: 'Image zooms inside frame' },
  { id: 'tilt', label: 'Tilt', desc: '3D tilt on cursor' },
  { id: 'glow', label: 'Glow', desc: 'Accent glow halo' },
  { id: 'slide', label: 'Slide reveal', desc: 'Overlay slides up' },
  { id: 'none', label: 'None', desc: 'No effect' },
];

function newBlock(type: BlockType): ContentBlock {
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
  if (type === 'gallery') return { id, type, images: ['', '', ''] };
  return { id, type, content: '' };
}

function ProjectEditor({ project, onClose }: { project: Project; onClose: () => void }) {
  const { dispatch } = useApp();
  const [draft, setDraft] = useState<Project>(project);

  const update = (patch: Partial<Project>) => setDraft({ ...draft, ...patch });
  const updateBlock = (idx: number, patch: Partial<ContentBlock>) => {
    const blocks = [...(draft.blocks || [])];
    blocks[idx] = { ...blocks[idx], ...patch };
    setDraft({ ...draft, blocks });
  };
  const addBlock = (type: BlockType) => setDraft({ ...draft, blocks: [...(draft.blocks || []), newBlock(type)] });
  const removeBlock = (idx: number) => setDraft({ ...draft, blocks: (draft.blocks || []).filter((_, i) => i !== idx) });
  const moveBlock = (idx: number, dir: -1 | 1) => {
    const blocks = [...(draft.blocks || [])];
    const j = idx + dir;
    if (j < 0 || j >= blocks.length) return;
    [blocks[idx], blocks[j]] = [blocks[j], blocks[idx]];
    setDraft({ ...draft, blocks });
  };

  const applyTemplate = (id: ProjectTemplate) => {
    const tpl = TEMPLATES.find(t => t.id === id)!;
    if (draft.blocks && draft.blocks.length > 0) {
      if (!confirm('Replace existing content blocks with this template?')) return;
    }
    setDraft({ ...draft, template: id, blocks: tpl.starter.map(b => ({ ...b, id: Date.now().toString() + Math.random().toString(36).slice(2, 6) })) });
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PROJECT', payload: draft });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto">
      <div className="container mx-auto px-6 md:px-12 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-muted-foreground mb-1">Editing project</p>
            <h2 className="font-display text-2xl font-bold text-foreground">{draft.title || 'Untitled'}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className={btnGhost}>Cancel</button>
            <Link to={`/projects/${draft.id}`} target="_blank" className={btnGhost}>Preview ↗</Link>
            <button onClick={handleSave} className={btnPrimary}>Save</button>
          </div>
        </div>

        {/* Meta */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-display text-base font-semibold mb-4">Project details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Title</label><input value={draft.title} onChange={e => update({ title: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Category</label><input value={draft.category} onChange={e => update({ category: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Year</label><input value={draft.year} onChange={e => update({ year: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Tech (comma sep.)</label><input value={draft.tech.join(', ')} onChange={e => update({ tech: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className={inputClass} /></div>
            <div className="md:col-span-2"><label className={labelClass}>Description (1–2 lines)</label><textarea value={draft.description} onChange={e => update({ description: e.target.value })} rows={2} className={inputClass + ' resize-none'} /></div>
            <div className="md:col-span-2">
              <label className={labelClass}>Cover image (URL or upload)</label>
              <ImagePicker value={draft.image || ''} onChange={url => update({ image: url })} />
            </div>
            <div><label className={labelClass}>Card size on /projects page</label>
              <select value={draft.bentoSize || 'sm'} onChange={e => update({ bentoSize: e.target.value as any })} className={inputClass}>
                <option value="sm">Small</option><option value="md">Medium (wide)</option><option value="lg">Large (hero)</option>
              </select>
            </div>
            <div><label className={labelClass}>Card size on Home (featured grid)</label>
              <select value={draft.homeBentoSize || draft.bentoSize || 'sm'} onChange={e => update({ homeBentoSize: e.target.value as any })} className={inputClass}>
                <option value="sm">Small</option><option value="md">Medium (wide)</option><option value="lg">Large (hero)</option>
              </select>
            </div>
            <div><label className={labelClass}>External link</label><input value={draft.link || ''} onChange={e => update({ link: e.target.value })} className={inputClass} placeholder="https://..." /></div>
            <div className="md:col-span-2">
              <label className={labelClass}>Hover animation (used on /projects page only — landing always uses default lift)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HOVER_ANIMATIONS.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => update({ hoverAnimation: a.id })}
                    className={`text-left p-3 rounded-xl border transition-all ${(draft.hoverAnimation || 'lift') === a.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}
                  >
                    <div className="font-display text-xs font-semibold text-foreground">{a.label}</div>
                    <div className="font-body text-[10px] text-muted-foreground mt-0.5 leading-snug">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {draft.hoverAnimation === 'flip' && (
              <div className="md:col-span-2">
                <label className={labelClass}>Back-face image (shown after flip)</label>
                <p className="font-body text-[11px] text-muted-foreground/80 mb-2">Optional — if empty, the front cover is reused.</p>
                <ImagePicker value={draft.imageBack || ''} onChange={url => update({ imageBack: url })} placeholder="Back image URL or upload" />
              </div>
            )}
          </div>
        </div>

        {/* Templates */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-display text-base font-semibold mb-1">Template</h3>
          <p className="font-body text-xs text-muted-foreground mb-4">Choose a built-in starter or build custom blocks (Canva-like).</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => applyTemplate(t.id)}
                className={`text-left p-4 rounded-xl border transition-all ${draft.template === t.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-display text-sm font-semibold text-foreground">{t.label}</div>
                <div className="font-body text-xs text-muted-foreground mt-1">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Block editor */}
        <div className="glass-card p-6">
          <h3 className="font-display text-base font-semibold mb-4">Content blocks</h3>
          <div className="space-y-4 mb-6">
            {(draft.blocks || []).map((block, idx) => (
              <div key={block.id} className="border border-border rounded-xl p-4 bg-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-primary/70">{block.type}</span>
                  <div className="flex gap-1">
                    <button onClick={() => moveBlock(idx, -1)} className="text-xs text-muted-foreground hover:text-foreground px-2">↑</button>
                    <button onClick={() => moveBlock(idx, 1)} className="text-xs text-muted-foreground hover:text-foreground px-2">↓</button>
                    <button onClick={() => removeBlock(idx)} className="text-xs text-destructive/60 hover:text-destructive px-2">✕</button>
                  </div>
                </div>

                {(block.type === 'heading' || block.type === 'paragraph' || block.type === 'quote') && (
                  <textarea value={block.content || ''} onChange={e => updateBlock(idx, { content: e.target.value })} rows={block.type === 'paragraph' ? 4 : 2} className={inputClass + ' resize-none'} placeholder={`Enter ${block.type}...`} />
                )}
                {block.type === 'image' && (
                  <div className="space-y-2">
                    <ImagePicker value={block.content || ''} onChange={url => updateBlock(idx, { content: url })} />
                    <input value={block.caption || ''} onChange={e => updateBlock(idx, { caption: e.target.value })} className={inputClass} placeholder="Caption (optional)" />
                  </div>
                )}
                {block.type === 'chart' && (
                  <div className="space-y-2">
                    <ImagePicker value={block.content || ''} onChange={url => updateBlock(idx, { content: url })} placeholder="Chart image URL or upload" />
                    <input value={block.caption || ''} onChange={e => updateBlock(idx, { caption: e.target.value })} className={inputClass} placeholder="Chart caption" />
                  </div>
                )}
                {block.type === 'gallery' && (
                  <div className="space-y-3">
                    {(block.images || []).map((src, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="flex-1">
                          <ImagePicker
                            value={src}
                            onChange={url => {
                              const images = [...(block.images || [])];
                              images[i] = url;
                              updateBlock(idx, { images });
                            }}
                            placeholder={`Image ${i + 1} URL`}
                          />
                        </div>
                        <button onClick={() => updateBlock(idx, { images: (block.images || []).filter((_, j) => j !== i) })} className="text-destructive/60 hover:text-destructive px-3 py-2.5">✕</button>
                      </div>
                    ))}
                    <button onClick={() => updateBlock(idx, { images: [...(block.images || []), ''] })} className={btnGhost}>+ Add image</button>
                  </div>
                )}
                {block.type === 'divider' && <div className="text-center text-muted-foreground text-xs">— divider —</div>}
              </div>
            ))}
          </div>

          <div>
            <p className={labelClass}>Add a block</p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_TYPES.map(b => (
                <button key={b.type} onClick={() => addBlock(b.type)} className="px-4 py-2 rounded-xl border border-border bg-card text-sm font-body text-foreground hover:border-primary/40 hover:text-primary transition-all flex items-center gap-2">
                  <span>{b.icon}</span><span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPanel() {
  const state = useAppRaw(); const { dispatch } = useApp();
  const [editing, setEditing] = useState<Project | null>(null);

  const createNew = () => {
    const id = Date.now().toString();
    const fresh: Project = {
      id, title: 'New Project', description: 'Short tagline goes here.', tech: [], year: new Date().getFullYear().toString(),
      category: 'Uncategorized', template: 'longform', blocks: [], bentoSize: 'sm', featured: true, hoverAnimation: 'lift',
    };
    dispatch({ type: 'ADD_PROJECT', payload: fresh });
    // Auto-add to featured grid so the new project appears on the landing page immediately.
    if (!state.featuredProjectIds.includes(id)) {
      dispatch({ type: 'SET_FEATURED', payload: [...state.featuredProjectIds, id] });
    }
    setEditing(fresh);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">All Projects</h3>
          <p className="font-body text-xs text-muted-foreground mt-1">{state.projects.length} total · click any to edit</p>
        </div>
        <button onClick={createNew} className={btnPrimary}>+ New Project</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.projects.map(p => (
          <div key={p.id} className="glass-card overflow-hidden group">
            {p.image && (
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] text-primary/70">{p.year}</span>
                <span className="font-mono text-[10px] text-muted-foreground">· {p.category}</span>
                {p.template && <span className="ml-auto font-mono text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{p.template}</span>}
              </div>
              <h4 className="font-display text-base font-semibold text-foreground mb-1">{p.title}</h4>
              <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
              <div className="flex gap-2">
                <button onClick={() => setEditing(p)} className={btnGhost + ' flex-1'}>Edit</button>
                <Link to={`/projects/${p.id}`} target="_blank" className={btnGhost}>↗</Link>
                <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) dispatch({ type: 'REMOVE_PROJECT', payload: p.id }); }} className="px-3 py-2 rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-all text-sm">×</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <ProjectEditor project={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
