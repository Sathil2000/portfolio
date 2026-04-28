import { useRef, useState } from 'react';
import { Upload, Link2, X, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  /** Max source file size in KB. Larger files are still accepted but will be downscaled. */
  maxKB?: number;
  /** Max output width/height after downscale (default 1600px) */
  maxDimension?: number;
  /** Output JPEG quality 0-1 (default 0.82) */
  quality?: number;
}

const inputClass = "w-full bg-card border border-border focus:border-primary/40 rounded-xl px-4 py-2.5 font-body text-sm text-foreground outline-none transition-all duration-300";

/**
 * Downscale an image File via canvas to keep base64 small enough for localStorage.
 * Returns a JPEG/PNG data URL.
 */
async function downscaleImage(file: File, maxDim: number, quality: number): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('read failed'));
    r.readAsDataURL(file);
  });
  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('decode failed'));
    i.src = dataUrl;
  });
  const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas context unavailable');
  ctx.drawImage(img, 0, 0, w, h);
  // PNG for transparent images, JPEG otherwise
  const isPng = file.type === 'image/png';
  return canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality);
}

export default function ImagePicker({ value, onChange, placeholder = 'https://...', maxKB = 8000, maxDimension = 1600, quality = 0.82 }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) return setError('Please select an image file.');
    if (file.size > maxKB * 1024) return setError(`Image too large (max ${maxKB}KB).`);
    setBusy(true);
    try {
      const out = await downscaleImage(file, maxDimension, quality);
      // Hard cap at ~1.5MB of base64 to stay safely under localStorage quota.
      if (out.length > 1_500_000) {
        // Try a more aggressive pass.
        const smaller = await downscaleImage(file, 1100, 0.7);
        onChange(smaller);
      } else {
        onChange(out);
      }
    } catch (err) {
      setError('Could not process image. Try a smaller file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={value.startsWith('data:') ? '(uploaded image)' : value}
            onChange={e => onChange(e.target.value)}
            disabled={value.startsWith('data:')}
            placeholder={placeholder}
            className={inputClass + ' pl-9'}
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1.5 text-xs font-body text-muted-foreground shrink-0 disabled:opacity-50"
          title="Upload from computer"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {busy ? 'Processing…' : 'Upload'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setError(null); }}
            className="px-3 py-2.5 rounded-xl border border-border bg-card hover:border-destructive/40 hover:text-destructive transition-all shrink-0"
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
      {error && <p className="font-body text-[11px] text-destructive">{error}</p>}
      {value && (
        <img src={value} alt="" className="max-h-32 rounded-lg border border-border object-cover" />
      )}
    </div>
  );
}
