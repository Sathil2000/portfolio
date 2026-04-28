import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

// ===== Types =====
export type BlockType = 'heading' | 'paragraph' | 'image' | 'quote' | 'chart' | 'gallery' | 'divider';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content?: string;        // text for heading/paragraph/quote, url for image/chart
  caption?: string;        // image caption
  images?: string[];       // gallery
  align?: 'left' | 'center' | 'right';
}

export type ProjectTemplate = 'longform' | 'gallery' | 'data' | 'custom';
export type HoverAnimation = 'lift' | 'flip' | 'zoom' | 'tilt' | 'glow' | 'slide' | 'none';

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  year: string;
  category: string;
  image?: string;          // cover image (URL or base64 data URL)
  imageBack?: string;      // back-face image (used by flip animation)
  link?: string;
  template?: ProjectTemplate;
  blocks?: ContentBlock[];
  featured?: boolean;
  bentoSize?: 'sm' | 'md' | 'lg';        // size on /projects page
  homeBentoSize?: 'sm' | 'md' | 'lg';    // size in landing featured grid (independent)
  hoverAnimation?: HoverAnimation;
}

export interface HeroFilter {
  type: 'none' | 'sharpen' | 'vivid' | 'cinematic' | 'noir' | 'warm' | 'cool' | 'dreamy';
  strength: number; // 0-100
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
  read?: boolean;
}

export interface SeasonalGreeting {
  id: string;
  name: string;
  message: string;
  animationType: 'snowfall' | 'halloween' | 'fireworks' | 'hearts' | 'rain' | 'confetti' | 'none';
  stickerUrl?: string;
  themeColor?: string;
  active: boolean;
}

export interface Skill { id: string; name: string; level: number; }
export interface Experience { id: string; year: string; role: string; company: string; }
export interface Testimonial { id: string; name: string; role: string; text: string; }

export interface AppState {
  isAuthenticated: boolean;
  twoFactorPending: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroImage?: string;             // optional override (URL or data URL)
  heroFilter: HeroFilter;
  accentColor: string;
  aboutBio: string;
  skills: Skill[];
  experiences: Experience[];
  testimonials: Testimonial[];
  featuredProjectIds: string[];
  projects: Project[];
  seasonalGreetings: SeasonalGreeting[];
  contactEmail: string;
  contactMessage: string;
  socials: SocialLinks;
  messages: ContactMessage[];
  analyticsData: {
    pageViews: number[];
    users: number[];
    engagement: number[];
    labels: string[];
  };
  landingMockHidden: boolean;
  adminMockHidden: boolean;
}

type Action =
  | { type: 'LOGIN_STEP1' }
  | { type: 'LOGIN_COMPLETE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_HERO'; payload: Partial<Pick<AppState, 'heroTitle' | 'heroSubtitle' | 'heroTagline' | 'heroImage'>> }
  | { type: 'UPDATE_HERO_FILTER'; payload: Partial<HeroFilter> }
  | { type: 'UPDATE_ACCENT'; payload: string }
  | { type: 'UPDATE_ABOUT'; payload: { aboutBio: string } }
  | { type: 'UPDATE_SOCIALS'; payload: SocialLinks }
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'SET_EXPERIENCES'; payload: Experience[] }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'SET_TESTIMONIALS'; payload: Testimonial[] }
  | { type: 'ADD_TESTIMONIAL'; payload: Testimonial }
  | { type: 'REMOVE_TESTIMONIAL'; payload: string }
  | { type: 'SET_FEATURED'; payload: string[] }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'SET_SEASONAL'; payload: SeasonalGreeting[] }
  | { type: 'TOGGLE_SEASONAL'; payload: string }
  | { type: 'ADD_SEASONAL'; payload: SeasonalGreeting }
  | { type: 'REMOVE_SEASONAL'; payload: string }
  | { type: 'UPDATE_CONTACT'; payload: Partial<Pick<AppState, 'contactEmail' | 'contactMessage'>> }
  | { type: 'ADD_MESSAGE'; payload: ContactMessage }
  | { type: 'REMOVE_MESSAGE'; payload: string }
  | { type: 'MARK_MESSAGE_READ'; payload: string }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'TOGGLE_LANDING_MOCK' }
  | { type: 'TOGGLE_ADMIN_MOCK' }
  | { type: 'HYDRATE'; payload: Partial<AppState> };

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Aurora Atlas',
    description: 'A real-time interactive map visualizing aurora borealis activity across the Arctic with predictive AI.',
    tech: ['React', 'WebGL', 'Python', 'TensorFlow'],
    year: '2025',
    category: 'Data Viz',
    template: 'longform',
    featured: true,
    bentoSize: 'lg',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200',
    blocks: [
      { id: 'b1', type: 'paragraph', content: 'Aurora Atlas is a research-grade visualization built for atmospheric scientists and aurora chasers alike. It blends NOAA satellite feeds with custom ML models to predict KP-index spikes 48 hours in advance.' },
      { id: 'b2', type: 'image', content: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1600', caption: 'Aurora over the Lofoten Islands, Norway.' },
      { id: 'b3', type: 'heading', content: 'The Challenge' },
      { id: 'b4', type: 'paragraph', content: 'Traditional models rely on static thresholds. Our approach treats geomagnetic data as a temporal signal, learning patterns across solar cycles.' },
      { id: 'b5', type: 'quote', content: 'It changed how we plan our expeditions — accuracy went from 60% to 92%.' },
    ],
  },
  {
    id: '2',
    title: 'Drift Studio',
    description: 'A canvas-based generative design tool letting brands create infinite logo variations from a seed concept.',
    tech: ['TypeScript', 'Canvas API', 'Three.js'],
    year: '2024',
    category: 'Creative Tech',
    template: 'gallery',
    featured: true,
    bentoSize: 'md',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200',
    blocks: [
      { id: 'b1', type: 'gallery', images: [
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
        'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      ] },
      { id: 'b2', type: 'paragraph', content: 'Used by 200+ design teams to explore brand directions in minutes instead of weeks.' },
    ],
  },
  {
    id: '3',
    title: 'Meridian OS',
    description: 'A minimal operating system interface concept for next-gen spatial computing devices.',
    tech: ['React', 'WebGPU', 'Rust'],
    year: '2025',
    category: 'Systems',
    template: 'data',
    featured: true,
    bentoSize: 'md',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200',
  },
  {
    id: '4',
    title: 'Cipher Protocol',
    description: 'An end-to-end encrypted messaging layer built on decentralized identity standards.',
    tech: ['Go', 'libp2p', 'WebAssembly'],
    year: '2024',
    category: 'Security',
    template: 'longform',
    featured: true,
    bentoSize: 'sm',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
  },
  {
    id: '5',
    title: 'Pulse Analytics',
    description: 'Real-time SaaS analytics platform processing 2M+ events/day with sub-second query response.',
    tech: ['ClickHouse', 'Kafka', 'Next.js'],
    year: '2023',
    category: 'SaaS',
    template: 'data',
    featured: false,
    bentoSize: 'lg',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
  },
];

const defaultSkills: Skill[] = [
  { id: 's1', name: 'React / Next.js', level: 95 },
  { id: 's2', name: 'TypeScript', level: 90 },
  { id: 's3', name: 'Node.js / Go', level: 85 },
  { id: 's4', name: 'UI/UX Design', level: 88 },
  { id: 's5', name: 'Cloud & DevOps', level: 78 },
  { id: 's6', name: 'AI / ML', level: 72 },
];

const defaultExperiences: Experience[] = [
  { id: 'e1', year: '2025–Now', role: 'Lead Creative Developer', company: 'Freelance' },
  { id: 'e2', year: '2023–2025', role: 'Full-Stack Engineer', company: 'TechVerse Inc.' },
  { id: 'e3', year: '2021–2023', role: 'Frontend Developer', company: 'Digital Studio' },
];

const defaultTestimonials: Testimonial[] = [
  { id: 't1', name: 'Alex Chen', role: 'CEO, TechStart', text: 'Exceptional work. The attention to detail is remarkable.' },
  { id: 't2', name: 'Sara Mitchell', role: 'Design Lead, Figma', text: "One of the most talented developers I've ever worked with." },
  { id: 't3', name: 'James Park', role: 'CTO, CloudBase', text: 'Delivered a flawless product ahead of schedule. Truly impressive.' },
  { id: 't4', name: 'Lisa Wang', role: 'Product Manager, Meta', text: 'Creative solutions to complex problems. Highly recommended.' },
  { id: 't5', name: 'David Kumar', role: 'Founder, DesignCo', text: 'The perfect blend of design sense and technical skill.' },
  { id: 't6', name: 'Emma Taylor', role: 'VP Eng, Stripe', text: 'Outstanding communication and code quality throughout.' },
];

const defaultState: AppState = {
  isAuthenticated: false,
  twoFactorPending: false,
  heroTitle: 'Crafting Calm Digital Experiences',
  heroSubtitle: 'Designer & developer building thoughtful, atmospheric interfaces.',
  heroTagline: 'PORTFOLIO • 2026',
  heroImage: undefined,
  heroFilter: { type: 'vivid', strength: 35 },
  accentColor: 'teal',
  aboutBio: 'A creative developer passionate about building beautiful, performant digital experiences that blend art and technology. I focus on motion, atmosphere, and the small details that make interfaces feel alive.',
  skills: defaultSkills,
  experiences: defaultExperiences,
  testimonials: defaultTestimonials,
  featuredProjectIds: ['1', '2', '3', '4'],
  projects: defaultProjects,
  seasonalGreetings: [
    { id: '1', name: 'Christmas', message: '❄️ Happy Holidays! Wishing you a season of joy and code.', animationType: 'snowfall', themeColor: '#3b82f6', active: false },
    { id: '2', name: 'Halloween', message: '🕷️ Happy Halloween! Beware of bugs in your code...', animationType: 'halloween', themeColor: '#f97316', active: false },
  ],
  contactEmail: 'hello@portfolio.dev',
  contactMessage: "Got a project in mind? Let's build something extraordinary together.",
  socials: { github: '', linkedin: '', twitter: '' },
  messages: [],
  analyticsData: {
    pageViews: [1200, 1900, 3000, 2800, 3400, 4100, 3800, 4500, 5200, 4800, 5600, 6200],
    users: [400, 600, 900, 850, 1100, 1400, 1300, 1500, 1800, 1650, 1900, 2100],
    engagement: [65, 72, 68, 75, 80, 78, 82, 85, 79, 88, 90, 87],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  landingMockHidden: false,
  adminMockHidden: false,
};

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('portfolio-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed, isAuthenticated: false, twoFactorPending: false };
    }
  } catch {}
  return defaultState;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN_STEP1': return { ...state, twoFactorPending: true };
    case 'LOGIN_COMPLETE': return { ...state, isAuthenticated: true, twoFactorPending: false };
    case 'LOGOUT': return { ...state, isAuthenticated: false, twoFactorPending: false };
    case 'UPDATE_HERO': return { ...state, ...action.payload };
    case 'UPDATE_HERO_FILTER': return { ...state, heroFilter: { ...state.heroFilter, ...action.payload } };
    case 'UPDATE_ACCENT': return { ...state, accentColor: action.payload };
    case 'UPDATE_ABOUT': return { ...state, aboutBio: action.payload.aboutBio };
    case 'SET_SKILLS': return { ...state, skills: action.payload };
    case 'ADD_SKILL': return { ...state, skills: [...state.skills, action.payload] };
    case 'REMOVE_SKILL': return { ...state, skills: state.skills.filter(s => s.id !== action.payload) };
    case 'SET_EXPERIENCES': return { ...state, experiences: action.payload };
    case 'ADD_EXPERIENCE': return { ...state, experiences: [...state.experiences, action.payload] };
    case 'REMOVE_EXPERIENCE': return { ...state, experiences: state.experiences.filter(e => e.id !== action.payload) };
    case 'SET_TESTIMONIALS': return { ...state, testimonials: action.payload };
    case 'ADD_TESTIMONIAL': return { ...state, testimonials: [...state.testimonials, action.payload] };
    case 'REMOVE_TESTIMONIAL': return { ...state, testimonials: state.testimonials.filter(t => t.id !== action.payload) };
    case 'SET_FEATURED': return { ...state, featuredProjectIds: action.payload };
    case 'SET_PROJECTS': return { ...state, projects: action.payload };
    case 'ADD_PROJECT': return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT': return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'REMOVE_PROJECT': return { ...state, projects: state.projects.filter(p => p.id !== action.payload), featuredProjectIds: state.featuredProjectIds.filter(id => id !== action.payload) };
    case 'SET_SEASONAL': return { ...state, seasonalGreetings: action.payload };
    case 'TOGGLE_SEASONAL': return {
      ...state,
      seasonalGreetings: state.seasonalGreetings.map(s => s.id === action.payload ? { ...s, active: !s.active } : s),
    };
    case 'ADD_SEASONAL': return { ...state, seasonalGreetings: [...state.seasonalGreetings, action.payload] };
    case 'REMOVE_SEASONAL': return { ...state, seasonalGreetings: state.seasonalGreetings.filter(s => s.id !== action.payload) };
    case 'UPDATE_CONTACT': return { ...state, ...action.payload };
    case 'UPDATE_SOCIALS': return { ...state, socials: { ...state.socials, ...action.payload } };
    case 'ADD_MESSAGE': return { ...state, messages: [action.payload, ...state.messages] };
    case 'REMOVE_MESSAGE': return { ...state, messages: state.messages.filter(m => m.id !== action.payload) };
    case 'MARK_MESSAGE_READ': return { ...state, messages: state.messages.map(m => m.id === action.payload ? { ...m, read: true } : m) };
    case 'CLEAR_MESSAGES': return { ...state, messages: [] };
    case 'TOGGLE_LANDING_MOCK': return { ...state, landingMockHidden: !state.landingMockHidden };
    case 'TOGGLE_ADMIN_MOCK': return { ...state, adminMockHidden: !state.adminMockHidden };
    case 'HYDRATE': return { ...state, ...action.payload, isAuthenticated: false, twoFactorPending: false };
    default: return state;
  }
}

type Ctx = { state: AppState; rawState: AppState; dispatch: React.Dispatch<Action>; };
const AppContext = createContext<Ctx>({ state: defaultState, rawState: defaultState, dispatch: () => {} });

function applyVisibility(state: AppState): AppState {
  let view = state;
  if (state.landingMockHidden) {
    view = {
      ...view,
      heroTitle: '',
      heroSubtitle: '',
      heroTagline: '',
      aboutBio: '',
      contactMessage: '',
      testimonials: [],
    };
  }
  if (state.adminMockHidden) {
    view = {
      ...view,
      projects: [],
      featuredProjectIds: [],
      skills: [],
      experiences: [],
      seasonalGreetings: [],
    };
  }
  return view;
}

// Fields we never save to Supabase (session-only or local toggles)
const SKIP_FIELDS = ['isAuthenticated', 'twoFactorPending', 'analyticsData', 'landingMockHidden', 'adminMockHidden'];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [hydrated, setHydrated] = React.useState(false);

  // ── On mount: fetch global state from Supabase ──────────────────────────
  useEffect(() => {
    supabase
      .from('portfolio_config')
      .select('data')
      .eq('id', 'main')
      .single()
      .then(({ data, error }) => {
        if (!error && data?.data && Object.keys(data.data).length > 0) {
          dispatch({ type: 'HYDRATE', payload: data.data as Partial<AppState> });
        }
        setHydrated(true);
      })
      .catch(() => {
        // Supabase unreachable — fall back to localStorage silently
        setHydrated(true);
      });
  }, []);

  // ── Save to Supabase whenever admin changes state ───────────────────────
  useEffect(() => {
    if (!state.isAuthenticated || !hydrated) return;

    const toSave = Object.fromEntries(
      Object.entries(state).filter(([key]) => !SKIP_FIELDS.includes(key))
    );

    supabase
      .from('portfolio_config')
      .upsert({ id: 'main', data: toSave, updated_at: new Date().toISOString() })
      .then(({ error }) => {
        if (error) console.error('[Supabase] Save failed:', error.message);
      });
  }, [state, hydrated]);

  // ── Also keep localStorage as a local backup ───────────────────────────
  useEffect(() => {
    try {
      const { isAuthenticated, twoFactorPending, ...toSave } = state;
      const slim = {
        ...toSave,
        heroImage: toSave.heroImage?.startsWith('data:') ? undefined : toSave.heroImage,
        projects: toSave.projects.map(p => ({
          ...p,
          image: p.image?.startsWith('data:') ? undefined : p.image,
          imageBack: p.imageBack?.startsWith('data:') ? undefined : p.imageBack,
        })),
      };
      localStorage.setItem('portfolio-state', JSON.stringify(slim));
    } catch (err) {
      console.warn('[AppContext] localStorage save failed:', err);
    }
  }, [state]);

  // ── Show nothing until Supabase responds (avoids flash of default content) ──
  if (!hydrated) return null;

  const projected = applyVisibility(state);
  return (
    <AppContext.Provider value={{ state: projected, rawState: state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
/** Admin-only: read the underlying state ignoring mock-visibility toggles. */
export const useAppRaw = () => useContext(AppContext).rawState;
