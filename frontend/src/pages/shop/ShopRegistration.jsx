import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Store, Upload, Check, ShieldAlert } from 'lucide-react';
import api from '../../services/api.js';

const ShopRegistration = () => {
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.agentInfo?.pincode) {
      setPincode(user.agentInfo.pincode);
    }
  }, [user]);

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (user?.role !== 'Pincode Agent') {
      setError('Only Pincode Agents can register shops');
      setLoading(false);
      return;
    }

    if (user?.agentInfo?.pincode && pincode !== user.agentInfo.pincode) {
      setError(`You are restricted to register shops in your assigned pincode: ${user.agentInfo.pincode}`);
      setLoading(false);
      return;
    }

    if (!documentFile) {
      setError('Please upload a shop document/license');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('ownerName', ownerName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('pincode', pincode);
    formData.append('document', documentFile);

    try {
      await api.post('/api/shops', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Shop registered successfully and sent for verification!');
      setName('');
      setOwnerName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setDocumentFile(null);
      // Reset file input element
      const fileInput = document.getElementById('shop-document-file');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title Panel */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Store className="text-forge-gold w-6 h-6" /> Shop Registration & Tie-Up
        </h1>
        <p className="text-xs text-forge-grayText mt-0.5">Register a new shop in your assigned pincode area for business tie-up.</p>
      </div>

      {/* Form */}
      <div className="bg-forge-dark border border-forge-card/40 rounded-xl p-6 shadow-lg">
        
        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-800 text-red-200 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold text-forge-grayText uppercase tracking-wider">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2">Shop/Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Murugan Stores"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-forge-card/45 border border-forge-card text-white px-4 py-3 rounded-lg outline-none focus:border-forge-gold"
              />
            </div>
            <div>
              <label className="block mb-2">Owner Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Murugan Ramasamy"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-forge-card/45 border border-forge-card text-white px-4 py-3 rounded-lg outline-none focus:border-forge-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="owner@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-forge-card/45 border border-forge-card text-white px-4 py-3 rounded-lg outline-none focus:border-forge-gold lowercase"
              />
            </div>
            <div>
              <label className="block mb-2">Phone Number</label>
              <input
                type="text"
                required
                placeholder="9443210987"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-forge-card/45 border border-forge-card text-white px-4 py-3 rounded-lg outline-none focus:border-forge-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block mb-2">Shop Address</label>
              <input
                type="text"
                required
                placeholder="12, Crosscut Road, Gandhipuram"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-forge-card/45 border border-forge-card text-white px-4 py-3 rounded-lg outline-none focus:border-forge-gold"
              />
            </div>
            <div>
              <label className="block mb-2">Pincode</label>
              <input
                type="text"
                disabled={!!user?.agentInfo?.pincode}
                required
                placeholder="641001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-forge-card/25 border border-forge-card/50 text-forge-grayText px-4 py-3 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Shop License/Document Upload (PDF or Image)</label>
            <div className="relative border-2 border-dashed border-forge-card hover:border-forge-gold/45 rounded-lg p-6 flex flex-col items-center justify-center transition">
              <input
                type="file"
                id="shop-document-file"
                required
                onChange={handleFileChange}
                accept=".jpeg,.jpg,.png,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-forge-gold mb-2" />
              <p className="text-xs text-white">
                {documentFile ? documentFile.name : 'Select or drop file here'}
              </p>
              <p className="text-[10px] text-forge-grayText mt-1">JPEG, PNG, or PDF up to 5MB</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forge-gold hover:bg-forge-goldHover text-forge-dark font-bold py-3 rounded-lg shadow-lg uppercase tracking-wider text-[11px] mt-4 transition"
          >
            {loading ? 'Submitting Registration...' : 'Submit Shop Details'}
          </button>

        </form>

      </div>

    </div>
  );
};

export default ShopRegistration;
