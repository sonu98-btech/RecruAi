import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../services/dashboard.api';
import { candidateApi } from '../services/candidate.api';
import { callApi } from '../services/call.api';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import { Users, Building2, PhoneCall, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const [overviewRes, candidatesRes, callsRes] = await Promise.all([
        dashboardApi.getOverview(),
        candidateApi.getAll({ limit: 100 }),
        callApi.getAll({ limit: 100 }),
      ]);
      
      setData({
        ...(overviewRes.success ? overviewRes.data : {}),
        candidatesList: candidatesRes.success ? (candidatesRes.data?.items || candidatesRes.data || []) : [],
        callsList: callsRes.success ? (callsRes.data?.items || callsRes.data || []) : [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#09090b]">
        <Loader size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Candidates',
      value: data?.candidates ?? 0,
      icon: Users,
      color: 'text-zinc-300',
    },
    {
      title: 'Total Clients',
      value: data?.clients ?? 0,
      icon: Building2,
      color: 'text-zinc-300',
    },
    {
      title: 'Total Calls',
      value: data?.calls ?? 0,
      icon: PhoneCall,
      color: 'text-zinc-300',
    },
    {
      title: 'Pending Followups',
      value: data?.pendingFollowups ?? 0,
      icon: Calendar,
      color: 'text-zinc-300',
    },
  ];

  // Group candidates by status dynamically
  const statusCounts = {};
  data?.candidatesList?.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });
  const statusDataArray = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
  }));
  const statusData = statusDataArray.length > 0 ? statusDataArray : [
    { name: 'NEW', value: 8 },
    { name: 'SCREENING', value: 12 },
    { name: 'INTERVIEW', value: 5 },
    { name: 'SELECTED', value: 3 },
    { name: 'REJECTED', value: 2 },
  ];

  // Group calls by creation date day dynamically
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const callsCounts = {};
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    callsCounts[dayNames[d.getDay()]] = 0;
  }
  data?.callsList?.forEach(c => {
    const day = dayNames[new Date(c.createdAt).getDay()];
    if (callsCounts[day] !== undefined) {
      callsCounts[day]++;
    }
  });
  const callHistoryDataArray = Object.keys(callsCounts).map(day => ({
    date: day,
    calls: callsCounts[day],
  }));
  const callHistoryData = data?.callsList?.length > 0 ? callHistoryDataArray : [
    { date: 'Mon', calls: 15 },
    { date: 'Tue', calls: 24 },
    { date: 'Wed', calls: 38 },
    { date: 'Thu', calls: 30 },
    { date: 'Fri', calls: 45 },
  ];

  // Professional minimal chart colors (zinc/slate/blue shades)
  const COLORS = ['#3b82f6', '#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9'];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#09090b]">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-bold text-zinc-100 uppercase tracking-wider m-0">CRM Dashboard</h1>
        <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Live metrics & recruiter operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} hoverable={false} className="relative overflow-hidden border border-zinc-800 bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-bold text-zinc-100 mt-2 font-mono">{stat.value}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-400">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel border border-zinc-800 rounded-xl p-5">
          <h4 className="text-xs font-bold text-zinc-400 mb-6 uppercase tracking-wider">Calling Activity Timeline</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callHistoryData}>
                <defs>
                  <linearGradient id="callsGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#4b5563" fontSize={11} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#f4f4f5',
                  }}
                />
                <Area type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#callsGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800 rounded-xl p-5">
          <h4 className="text-xs font-bold text-zinc-400 mb-6 uppercase tracking-wider">Candidate Pipeline</h4>
          <div className="h-72 flex flex-col items-center justify-center">
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center mt-2.5">
              {statusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-zinc-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{item.name}: <strong className="text-zinc-200 font-mono">{item.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
