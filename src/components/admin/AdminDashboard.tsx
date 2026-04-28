import { useState } from 'react';
import { useApp, useAppRaw } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { BarChart3, FolderKanban, User, FileText, Sparkles, LogOut, Inbox, Eye, EyeOff } from 'lucide-react';
import AnalyticsPanel from './AnalyticsPanel';
import ProjectsPanel from './ProjectsPanel';
import AboutPanel from './AboutPanel';
import ContentPanel from './ContentPanel';
import SeasonalPanel from './SeasonalPanel';
import MessagesPanel from './MessagesPanel';

type Tab = 'analytics' | 'projects' | 'about' | 'messages' | 'content' | 'seasonal';

const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'about', label: 'About', icon: User },
  { id: 'messages', label: 'Messages', icon: Inbox },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'seasonal', label: 'Seasonal', icon: Sparkles },
];

export default function AdminDashboard() {
  const state = useAppRaw();
  const { dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('analytics');

  const unread = state.messages.filter(m => !m.read).length;
  const landingHidden = state.landingMockHidden;
  const adminHidden = state.adminMockHidden;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="pt-20 min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 min-h-[calc(100vh-5rem)] bg-card border-r border-border sticky top-20 self-start flex flex-col">
          <div className="p-6 border-b border-border">
            <h1 className="font-display text-xl font-bold text-foreground">Dashboard</h1>
            <p className="font-body text-xs text-muted-foreground mt-1">Manage your portfolio</p>
          </div>

          <nav className="p-3 flex flex-col gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-body text-sm transition-all ${
                    active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.id === 'messages' && unread > 0 && (
                    <span className="text-[10px] font-mono bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto p-3 space-y-2 border-t border-border">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70 px-2">Mock data</p>

            <button
              onClick={() => dispatch({ type: 'TOGGLE_LANDING_MOCK' })}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-body text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {landingHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="flex-1 text-left">Landing mock</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${landingHidden ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                {landingHidden ? 'OFF' : 'ON'}
              </span>
            </button>

            <button
              onClick={() => dispatch({ type: 'TOGGLE_ADMIN_MOCK' })}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-body text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {adminHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="flex-1 text-left">Admin mock</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${adminHidden ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                {adminHidden ? 'OFF' : 'ON'}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-body text-sm text-destructive hover:bg-destructive/5 transition-colors mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'analytics' && <AnalyticsPanel />}
            {activeTab === 'projects' && <ProjectsPanel />}
            {activeTab === 'about' && <AboutPanel />}
            {activeTab === 'messages' && <MessagesPanel />}
            {activeTab === 'content' && <ContentPanel />}
            {activeTab === 'seasonal' && <SeasonalPanel />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
