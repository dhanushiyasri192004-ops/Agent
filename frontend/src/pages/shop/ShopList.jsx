import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Store, Check, X, ShieldAlert, FileText, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';

const ShopList = () => {
  const { user } = useSelector((state) => state.auth);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [comments, setComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await api.get('/api/shops');
      setShops(response.data);
    } catch (err) {
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (shopId, status) => {
    setActionLoading(true);
    try {
      await api.patch(`/api/shops/${shopId}/verify`, { status, comments });
      setSelectedShop(null);
      setComments('');
      fetchShops();
    } catch (err) {
      console.error('Error verifying shop:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Verified') {
      return (
        <span className="flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/25">
          <CheckCircle className="w-3 h-3" /> Verified
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-red-500/10 text-red-400 border-red-500/25">
          <AlertCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/25 animate-pulse">
        <HelpCircle className="w-3 h-3" /> Pending
      </span>
    );
  };

  const isSuperiorRole = user?.role !== 'Pincode Agent';

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Store className="text-forge-gold w-6 h-6" /> Registered Shops List
        </h1>
        <p className="text-xs text-forge-grayText mt-0.5">
          {isSuperiorRole
            ? 'Review and verify business registrations submitted by your sub-agents.'
            : 'Track the verification status of shops you have registered.'}
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-forge-dark border border-forge-card/40 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-forge-grayText">Loading shops list...</div>
        ) : shops.length === 0 ? (
          <div className="p-12 text-center text-forge-grayText">No registered shops found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-forge-card/45 border-b border-forge-card/30 text-forge-gold uppercase font-bold tracking-wider">
                  <th className="p-4">Shop Name</th>
                  <th className="p-4">Owner Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Pincode</th>
                  <th className="p-4">District</th>
                  <th className="p-4">Agent</th>
                  <th className="p-4">Status</th>
                  {isSuperiorRole && <th className="p-4 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-card/25">
                {shops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-forge-card/10 text-slate-200">
                    <td className="p-4 font-semibold text-white">{shop.name}</td>
                    <td className="p-4">{shop.ownerName}</td>
                    <td className="p-4">{shop.phone}</td>
                    <td className="p-4 font-bold text-forge-gold">{shop.pincode}</td>
                    <td className="p-4">{shop.district}</td>
                    <td className="p-4 text-forge-grayText">{shop.createdBy?.email || 'System'}</td>
                    <td className="p-4">{getStatusBadge(shop.verificationStatus)}</td>
                    {isSuperiorRole && (
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedShop(shop)}
                          className="bg-forge-card hover:bg-forge-card/80 border border-forge-card/60 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Review Docs
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-forge-dark border border-forge-card rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-forge-card/45 pb-3">
              <h3 className="text-sm font-bold text-white">Review Shop Registration</h3>
              <button onClick={() => setSelectedShop(null)} className="text-forge-grayText hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shop Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-forge-grayText uppercase text-[10px]">Business Name</p>
                <p className="text-white font-bold text-sm mt-0.5">{selectedShop.name}</p>
              </div>
              <div>
                <p className="text-forge-grayText uppercase text-[10px]">Owner Name</p>
                <p className="text-white font-bold text-sm mt-0.5">{selectedShop.ownerName}</p>
              </div>
              <div>
                <p className="text-forge-grayText uppercase text-[10px]">Contact Info</p>
                <p className="text-white mt-0.5">{selectedShop.phone} • {selectedShop.email}</p>
              </div>
              <div>
                <p className="text-forge-grayText uppercase text-[10px]">Location Parameters</p>
                <p className="text-white mt-0.5">PIN: {selectedShop.pincode} • {selectedShop.district}</p>
              </div>
              <div className="col-span-2">
                <p className="text-forge-grayText uppercase text-[10px]">Address</p>
                <p className="text-white mt-0.5">{selectedShop.address}</p>
              </div>
            </div>

            {/* Document Link */}
            <div className="bg-forge-card/40 border border-forge-card p-4 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-8 h-8 text-forge-gold" />
                <div>
                  <p className="font-bold text-white">Business License Document</p>
                  <p className="text-[10px] text-forge-grayText">Click view to review files</p>
                </div>
              </div>
              <a
                href={selectedShop.documentUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-forge-gold hover:bg-forge-goldHover text-forge-dark font-bold px-3 py-1.5 rounded-lg transition"
              >
                View File
              </a>
            </div>

            {/* Review actions */}
            {selectedShop.verificationStatus === 'Pending' ? (
              <div className="space-y-4 pt-3 border-t border-forge-card/45 text-xs">
                <div>
                  <label className="block mb-1.5 font-semibold text-forge-grayText uppercase text-[10px]">Decision Remarks/Comments</label>
                  <textarea
                    rows="3"
                    placeholder="Enter approval notes or rejection reasons here..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full bg-forge-card/45 border border-forge-card text-white p-3 rounded-lg outline-none focus:border-forge-gold"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleVerify(selectedShop._id, 'Rejected')}
                    disabled={actionLoading}
                    className="bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/80 text-red-400 font-bold py-3 rounded-lg transition uppercase text-[10px] tracking-wider"
                  >
                    Reject Registration
                  </button>
                  <button
                    onClick={() => handleVerify(selectedShop._id, 'Verified')}
                    disabled={actionLoading}
                    className="bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/80 text-emerald-400 font-bold py-3 rounded-lg transition uppercase text-[10px] tracking-wider"
                  >
                    Approve & Verify
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-forge-card/45 text-center text-xs">
                <p className="text-forge-grayText">This shop registration has already been resolved.</p>
                <div className="mt-2 font-bold text-white bg-forge-card/30 p-2 rounded-lg inline-block border border-forge-card">
                  Status: {selectedShop.verificationStatus}
                </div>
                {selectedShop.comments && (
                  <p className="mt-2 text-forge-grayText italic">Remarks: "{selectedShop.comments}"</p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default ShopList;
