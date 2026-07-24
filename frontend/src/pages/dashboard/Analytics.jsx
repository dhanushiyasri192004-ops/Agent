import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { BarChart3, HelpCircle } from 'lucide-react';
import api from '../../services/api.js';

const Analytics = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [metricsRes, shopsRes] = await Promise.allSettled([
        api.get('/api/dashboard/metrics'),
        api.get('/api/shops')
      ]);
      if (metricsRes.status === 'fulfilled') setData(metricsRes.value.data);
      if (shopsRes.status === 'fulfilled' && Array.isArray(shopsRes.value.data)) setShops(shopsRes.value.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const assignedDistrict = user?.agentInfo?.district || user?.district || 'Salem District';
  const assignedDivision = user?.agentInfo?.division || user?.division || 'Attur Division';
  const districtRegex = new RegExp(assignedDistrict.replace(/District/i, '').trim(), 'i');
  const divRegex = new RegExp(assignedDivision.replace(/Division/i, '').trim(), 'i');

  const filteredShops = user?.role === 'District Agent' 
    ? shops.filter(s => s.district && districtRegex.test(s.district))
    : user?.role === 'Divisional Agent'
    ? shops.filter(s => s.division && divRegex.test(s.division))
    : shops;

  const currentMonthShops = filteredShops.length;

  const monthlyGrowthData = [
    { month: 'Jan', shops: 0, target: currentMonthShops },
    { month: 'Feb', shops: 0, target: currentMonthShops },
    { month: 'Mar', shops: 0, target: currentMonthShops },
    { month: 'Apr', shops: 0, target: currentMonthShops },
    { month: 'May', shops: 0, target: currentMonthShops },
    { month: 'Jun', shops: currentMonthShops, target: currentMonthShops },
  ];

  const subAgentPerformanceData = user?.role === 'District Agent'
    ? [
        { name: `${assignedDistrict} Zone 1`, shops: filteredShops.length, target: filteredShops.length },
        { name: `${assignedDistrict} Zone 2`, shops: 0, target: 0 },
      ]
    : user?.role === 'Divisional Agent'
    ? [
        { name: `${assignedDivision} Zone 1`, shops: filteredShops.length, target: filteredShops.length },
        { name: `${assignedDivision} Zone 2`, shops: 0, target: 0 },
      ]
    : [
        { name: 'Chennai Division', shops: shops.filter(s => s.division?.includes('Chennai') || s.district?.includes('Chennai')).length, target: shops.filter(s => s.division?.includes('Chennai') || s.district?.includes('Chennai')).length },
        { name: 'Coimbatore', shops: shops.filter(s => s.division?.includes('Coimbatore') || s.district?.includes('Coimbatore')).length, target: shops.filter(s => s.division?.includes('Coimbatore') || s.district?.includes('Coimbatore')).length },
        { name: 'Madurai', shops: shops.filter(s => s.division?.includes('Madurai') || s.district?.includes('Madurai')).length, target: shops.filter(s => s.division?.includes('Madurai') || s.district?.includes('Madurai')).length },
        { name: 'Trichy', shops: shops.filter(s => s.division?.includes('Trichy') || s.district?.includes('Trichy')).length, target: shops.filter(s => s.division?.includes('Trichy') || s.district?.includes('Trichy')).length },
        { name: 'Salem', shops: shops.filter(s => s.division?.includes('Salem') || s.district?.includes('Salem')).length, target: shops.filter(s => s.division?.includes('Salem') || s.district?.includes('Salem')).length },
      ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="text-forge-gold w-6 h-6" /> Data Analytics & Business Insights
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Explore deep insights and performance trends regarding shops registrations.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading analytics panels...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Registration Growth Chart */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Monthly Registration Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                  <Line type="monotone" dataKey="shops" stroke="#d9a32c" name="Shops Connected" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="target" stroke="#1e3c72" name="Target Shops" strokeWidth={2.5} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Performance Targets Chart */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Regional Registration Targets</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subAgentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                  <Bar dataKey="shops" fill="#d9a32c" name="Verified Shops" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="#1e3c72" name="Assigned Goal" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Analytics;
