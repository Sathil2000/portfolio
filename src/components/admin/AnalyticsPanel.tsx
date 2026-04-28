import { useApp, useAppRaw } from '@/contexts/AppContext';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPanel() {
  const state = useAppRaw();
  const chartData = state.analyticsData.labels.map((label, i) => ({
    name: label,
    views: state.analyticsData.pageViews[i],
    users: state.analyticsData.users[i],
    engagement: state.analyticsData.engagement[i],
  }));

  const stats = [
    { label: 'Total Views', value: '42.8K', change: '+12.4%' },
    { label: 'Active Users', value: '2.1K', change: '+8.7%' },
    { label: 'Engagement', value: '87%', change: '+3.2%' },
    { label: 'Bounce Rate', value: '23%', change: '-5.1%' },
  ];

  const tooltipStyle = {
    contentStyle: { background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(215, 20%, 88%)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    labelStyle: { color: 'hsl(220, 20%, 14%)' },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass-card p-5">
            <p className="font-body text-xs text-muted-foreground mb-2">{s.label}</p>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="font-mono text-xs text-primary mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-body text-sm text-muted-foreground mb-4">Page Views</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200, 70%, 45%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(200, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215, 12%, 50%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 12%, 50%)' }} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="views" stroke="hsl(200, 70%, 45%)" fill="url(#viewsG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-body text-sm text-muted-foreground mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215, 12%, 50%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 12%, 50%)' }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="users" fill="hsl(170, 50%, 42%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="font-body text-sm text-muted-foreground mb-4">Engagement Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215, 12%, 50%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 12%, 50%)' }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="engagement" stroke="hsl(25, 85%, 58%)" strokeWidth={2} dot={{ fill: 'hsl(25, 85%, 58%)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
