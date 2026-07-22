import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp,
  Map,
  Users,
  Store,
  MapPin,
  Clock,
  Compass,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const DivisionalDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/dashboard/metrics', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching divisional metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-forge-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const divisionDistrictMap = {
    'chennai': [
      { name: 'Chennai', pincodes: 150, shops: '2,450' },
      { name: 'Chengalpattu', pincodes: 95, shops: '1,850' },
      { name: 'Kanchipuram', pincodes: 80, shops: '1,200' },
      { name: 'Tiruvallur', pincodes: 75, shops: '900' }
    ],
    'vellore': [
      { name: 'Vellore', pincodes: 90, shops: '1,500' },
      { name: 'Ranipet', pincodes: 65, shops: '1,100' },
      { name: 'Tirupathur', pincodes: 55, shops: '850' },
      { name: 'Tiruvannamalai', pincodes: 70, shops: '950' }
    ],
    'salem': [
      { name: 'Salem', pincodes: 110, shops: '2,100' },
      { name: 'Namakkal', pincodes: 75, shops: '1,300' },
      { name: 'Dharmapuri', pincodes: 60, shops: '950' },
      { name: 'Krishnagiri', pincodes: 70, shops: '1,050' }
    ],
    'coimbatore': [
      { name: 'Coimbatore', pincodes: 120, shops: '2,450' },
      { name: 'Tiruppur', pincodes: 85, shops: '1,850' },
      { name: 'Erode', pincodes: 60, shops: '1,200' },
      { name: 'The Nilgiris', pincodes: 55, shops: '900' }
    ],
    'tiruchirappalli': [
      { name: 'Tiruchirappalli', pincodes: 100, shops: '1,950' },
      { name: 'Karur', pincodes: 55, shops: '950' },
      { name: 'Perambalur', pincodes: 40, shops: '650' },
      { name: 'Ariyalur', pincodes: 45, shops: '700' }
    ],
    'thanjavur': [
      { name: 'Thanjavur', pincodes: 95, shops: '1,750' },
      { name: 'Tiruvarur', pincodes: 60, shops: '1,050' },
      { name: 'Nagapattinam', pincodes: 55, shops: '900' },
      { name: 'Mayiladuthurai', pincodes: 50, shops: '800' }
    ],
    'madurai': [
      { name: 'Madurai', pincodes: 115, shops: '2,150' },
      { name: 'Dindigul', pincodes: 80, shops: '1,450' },
      { name: 'Theni', pincodes: 60, shops: '950' },
      { name: 'Sivagangai', pincodes: 55, shops: '850' },
      { name: 'Ramanathapuram', pincodes: 65, shops: '900' }
    ],
    'tirunelveli': [
      { name: 'Tirunelveli', pincodes: 105, shops: '1,850' },
      { name: 'Tenkasi', pincodes: 70, shops: '1,150' },
      { name: 'Thoothukudi', pincodes: 75, shops: '1,250' },
      { name: 'Kanniyakumari', pincodes: 80, shops: '1,350' },
      { name: 'Virudhunagar', pincodes: 70, shops: '1,100' }
    ]
  };

  const getDivisionKey = () => {
    const div = user?.agentInfo?.division || 'Chennai';
    return div.toLowerCase().replace(' division', '').trim();
  };

  const activeDivisionKey = getDivisionKey();
  const mockDistrictBreakdown = divisionDistrictMap[activeDivisionKey] || divisionDistrictMap['chennai'];

  const districtsCount = metrics?.districtsCount ?? 0;
  const districtAgentsCount = metrics?.districtAgentsCount ?? 0;
  const pincodeAgentsCount = metrics?.pincodeAgentsCount ?? 0;
  const shopsCount = metrics?.shopsRegisteredCount ?? 0;

  const liveDistrictBreakdown = mockDistrictBreakdown.map(d => {
    const match = metrics?.districtPerformance?.find(
      p => p.name?.toLowerCase() === d.name.toLowerCase()
    );
    return {
      name: d.name,
      pincodes: d.pincodes,
      shops: match ? match.value : 0
    };
  });

  const lineChartData = [
    { name: 'May 12', performance: 20 },
    { name: 'May 13', performance: 42 },
    { name: 'May 14', performance: 35 },
    { name: 'May 15', performance: 58 },
    { name: 'May 16', performance: 48 },
    { name: 'May 17', performance: 75 },
    { name: 'May 18', performance: 95 },
  ];

  const pieData = [
    { name: 'District Agents', value: metrics?.agentDistribution?.districtAgents || 0, color: '#10b981' },
    { name: 'Pincode Agents', value: metrics?.agentDistribution?.pincodeAgents || 0, color: '#f59e0b' },
  ];

  const topPerformingDistricts = mockDistrictBreakdown.map((d, index) => {
    const scores = {
      'chennai': '97%',
      'chengalpattu': '92%',
      'kanchipuram': '89%',
      'tiruvallur': '86%',
      'vellore': '90%',
      'ranipet': '85%',
      'tirupathur': '82%',
      'tiruvannamalai': '80%',
      'salem': '91%',
      'namakkal': '88%',
      'dharmapuri': '84%',
      'krishnagiri': '81%',
      'coimbatore': '95%',
      'tiruppur': '91%',
      'erode': '87%',
      'the nilgiris': '83%',
      'tiruchirappalli': '93%',
      'karur': '88%',
      'perambalur': '81%',
      'ariyalur': '79%',
      'thanjavur': '92%',
      'tiruvarur': '86%',
      'nagapattinam': '82%',
      'mayiladuthurai': '80%',
      'madurai': '94%',
      'dindigul': '89%',
      'theni': '83%',
      'sivagangai': '81%',
      'ramanathapuram': '78%',
      'tirunelveli': '92%',
      'tenkasi': '87%',
      'thoothukudi': '85%',
      'kanniyakumari': '83%',
      'virudhunagar': '80%'
    };
    const key = d.name.toLowerCase();
    return {
      rank: index + 1,
      name: d.name,
      score: scores[key] || '85%'
    };
  });

  const recentActivitiesList = [
    { text: 'New district agent added in Chennai', time: '20 mins ago', division: 'chennai' },
    { text: 'Pincode agent report submitted in Chengalpattu', time: '1 hour ago', division: 'chennai' },
    { text: 'Shop verified in Kanchipuram', time: '2 hours ago', division: 'chennai' },
    { text: 'New district agent added in Tirupur', time: '20 mins ago', division: 'coimbatore' },
    { text: 'Pincode agent report submitted in Coimbatore', time: '1 hour ago', division: 'coimbatore' },
    { text: 'Shop verified in Erode', time: '2 hours ago', division: 'coimbatore' },
    { text: 'District agent query resolved in Salem', time: '3 hours ago', division: 'salem' },
    { text: 'New shop registration in Madurai', time: '4 hours ago', division: 'madurai' }
  ];

  const filteredActivities = recentActivitiesList.filter(act => act.division === activeDivisionKey);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Welcome back, Chennai Division Agent 👋</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Division performance and activity monitor.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{districtsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Districts</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{districtAgentsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">District Agents</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{pincodeAgentsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Pincode Agents</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-black text-slate-800">{shopsCount}</span>
            <h3 className="text-sm text-slate-500 mt-1.5 font-bold">Shops Registered</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600">
            <Store className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Division Performance Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Division Performance</h3>
            <span className="text-xs text-forge-gold font-bold uppercase border border-forge-gold/30 bg-amber-50 px-2 py-0.5 rounded">This Week</span>
          </div>
          <div className="flex-1 h-60 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                <Line type="monotone" dataKey="performance" stroke="#d9a32c" name="Performance Rate" strokeWidth={2.5} dot={{ fill: '#d9a32c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Breakdown Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">District Breakdown</h3>
              <button className="text-xs text-forge-gold hover:underline font-bold">View All</button>
            </div>
            <div className="space-y-4">
              {liveDistrictBreakdown.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-extrabold text-slate-700">{d.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{d.pincodes} Pincode Agents</p>
                  </div>
                  <span className="font-bold text-slate-800">{d.shops} Shops</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row: Agent Distribution, Recent Activities, Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 w-full text-left mb-4">Agent Distribution</h3>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex items-center justify-around text-sm mt-4">
            {pieData.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-slate-500 font-bold">{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 mb-4">Recent Activities</h3>
          <div className="space-y-4 flex-1">
            {metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
              metrics.recentActivities.slice(0, 4).map((activity, idx) => (
                <div key={idx} className="flex gap-3 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-forge-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activity.user?.email || 'Agent'} • {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((act, idx) => (
                  <div key={idx} className="flex gap-3 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-forge-gold" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{act.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Districts */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Top Performing Districts</h3>
            <span className="text-xs text-forge-gold font-bold uppercase">This Week</span>
          </div>
          <div className="space-y-3.5 flex-1">
            {topPerformingDistricts.map((dist) => (
              <div key={dist.rank} className="flex items-center gap-3 text-sm">
                <span className="w-5 font-bold text-slate-400 text-center">{dist.rank}</span>
                <span className="flex-1 font-bold text-slate-700">{dist.name}</span>
                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-forge-gold h-full rounded-full" style={{ width: dist.score }}></div>
                </div>
                <span className="w-8 font-bold text-right text-forge-gold">{dist.score}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DivisionalDashboard;
