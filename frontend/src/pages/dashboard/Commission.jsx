import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Percent, ArrowUpRight, ShieldAlert, Award, FileText, TrendingUp, Users } from 'lucide-react';
import api from '../../services/api.js';

const Commission = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [adminStats, setAdminStats] = useState(null);
  const [payoutRequested, setPayoutRequested] = useState(false);

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    try {
      setLoading(true);
      if (user?.role === 'Admin') {
        const [statsRes, listRes] = await Promise.all([
          api.get('/api/commission/admin-stats'),
          api.get('/api/commission/my')
        ]);
        setAdminStats(statsRes.data);
        setCommissions(listRes.data.commissions || []);
      } else {
        const response = await api.get('/api/commission/my');
        setCommissions(response.data.commissions || []);
        setWalletBalance(response.data.walletBalance || 0);
      }
    } catch (err) {
      console.error('Error fetching commission data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Determine commission rate & flat share based on role
  let commissionRateLabel = '30%';
  let flatCommissionAmount = 150;
  let roleLabel = 'Pincode Agent';

  if (user?.role === 'Divisional Agent') {
    commissionRateLabel = '10%';
    flatCommissionAmount = 50;
    roleLabel = 'Divisional Agent';
  } else if (user?.role === 'District Agent') {
    commissionRateLabel = '10%';
    flatCommissionAmount = 50;
    roleLabel = 'District Agent';
  } else if (user?.role === 'State Agent') {
    commissionRateLabel = '10%';
    flatCommissionAmount = 50;
    roleLabel = 'State Agent';
  } else if (user?.role === 'Admin') {
    commissionRateLabel = '40%';
    flatCommissionAmount = 200;
    roleLabel = 'Admin / Company';
  }

  // Calculations for Agent
  const verifiedCommissions = commissions.filter(c => c.shopId?.verificationStatus === 'Verified');
  const pendingCommissions = commissions.filter(c => c.shopId?.verificationStatus === 'Pending');

  const totalEarnedVal = verifiedCommissions.length * flatCommissionAmount;
  const pendingPayoutVal = pendingCommissions.length * flatCommissionAmount;

  // Chart data based on live commissions
  const chartData = verifiedCommissions.slice(-6).map((c, idx) => ({
    name: c.shopId?.name ? c.shopId.name.slice(0, 10) : `Shop ${idx + 1}`,
    commission: flatCommissionAmount
  }));

  if (chartData.length === 0) {
    chartData.push({ name: 'No Data', commission: 0 });
  }

  const handleRequestPayout = async () => {
    try {
      const res = await api.post('/api/commission/payout');
      setWalletBalance(res.data.walletBalance || 0);
      setPayoutRequested(true);
      alert(res.data.message || 'Payout request submitted successfully!');
      fetchCommissionData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting payout');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <DollarSign className="text-emerald-500 w-7 h-7" /> Commission Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">
          Real-time tracking of partner onboarding payouts and agent incentives (Registration Fee: ₹500).
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Admin Dashboard Stats */}
          {user?.role === 'Admin' && adminStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Total Registration Fees</span>
                  <span className="block text-4xl font-black text-[#034ea2] mt-2">
                    ₹ {adminStats.totalRegistrationFees.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-extrabold block mt-2">From {adminStats.totalVerifiedShops} Verified Shop Registrations</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Company Earnings (40%)</span>
                  <span className="block text-4xl font-black text-emerald-600 mt-2">
                    ₹ {adminStats.companyEarnings.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-extrabold block mt-2">Admin / Wallet Balance</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Total Commission Paid</span>
                  <span className="block text-4xl font-black text-amber-600 mt-2">
                    ₹ {adminStats.totalCommissionPaid.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-extrabold block mt-2">Distributed to Agent Network</span>
                </div>
              </div>

              {/* Grid with breakdown of agent payouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <span className="block text-slate-500 text-xs font-black uppercase">Pincode Agents (30%)</span>
                  <span className="block text-xl font-black text-slate-800 mt-1">₹ {adminStats.paidToPincode.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <span className="block text-slate-500 text-xs font-black uppercase">Divisional Agents (10%)</span>
                  <span className="block text-xl font-black text-slate-800 mt-1">₹ {adminStats.paidToDivisional.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <span className="block text-slate-500 text-xs font-black uppercase">District Agents (10%)</span>
                  <span className="block text-xl font-black text-slate-800 mt-1">₹ {adminStats.paidToDistrict.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <span className="block text-slate-500 text-xs font-black uppercase">State Agents (10%)</span>
                  <span className="block text-xl font-black text-slate-800 mt-1">₹ {adminStats.paidToState.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Non-Admin Agent Dashboard Stats */}
          {user?.role !== 'Admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Commission Rate</span>
                <span className="block text-3xl font-black text-[#034ea2] mt-2 flex items-center justify-center gap-1">
                  <Percent className="w-6 h-6 text-[#f5c518]" /> {commissionRateLabel}
                </span>
                <span className="text-[10px] text-slate-500 font-extrabold block mt-1">Role: {roleLabel} (₹{flatCommissionAmount}/shop)</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Total Earned</span>
                <span className="block text-3xl font-black text-emerald-600 mt-2">
                  ₹ {totalEarnedVal.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 font-extrabold block mt-1">From {verifiedCommissions.length} verified shops</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Payout</span>
                <span className="block text-3xl font-black text-amber-600 mt-2">
                  ₹ {pendingPayoutVal.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 font-extrabold block mt-1">From {pendingCommissions.length} pending verification</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center items-center">
                <button
                  disabled={walletBalance <= 0}
                  onClick={handleRequestPayout}
                  className={`w-full font-extrabold py-3 px-4 rounded-lg text-xs shadow transition duration-200 flex items-center justify-center gap-1.5 ${
                    walletBalance <= 0 
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Request Payout (Wallet: ₹{walletBalance})
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-3 space-y-4">
              <h3 className="text-base font-bold text-slate-800">Recent Onboard Transactions</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="commission" fill="#10b981" radius={[4, 4, 0, 0]} name="Commission Earned (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed ledger */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-[#034ea2]" /> Shop Commission Ledger
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-3 px-4">SHOP NAME</th>
                    <th className="py-3 px-4">LOCATION</th>
                    <th className="py-3 px-4">REGISTRATION DATE</th>
                    <th className="py-3 px-4">VERIFICATION STATUS</th>
                    <th className="py-3 px-4">REGISTRATION FEE</th>
                    <th className="py-3 px-4">EARNED COMMISSION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {commissions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400">No commission records found.</td>
                    </tr>
                  ) : (
                    commissions.map((comm, index) => {
                      const shop = comm.shopId;
                      if (!shop) return null;
                      const commVal = shop.verificationStatus === 'Verified' ? flatCommissionAmount : 0;
                      return (
                        <tr key={comm._id || index} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-extrabold text-slate-805">{shop.name}</td>
                          <td className="py-3.5 px-4">{shop.pincode} - {shop.division || shop.district || 'Territory'}</td>
                          <td className="py-3.5 px-4">
                            {new Date(shop.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              shop.verificationStatus === 'Verified' 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {shop.verificationStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">₹ 500</td>
                          <td className="py-3.5 px-4 text-emerald-600 font-black">₹ {commVal.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Commission;
