import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Upload, Check, ShieldAlert } from 'lucide-react';
import api from '../../services/api.js';

const ShopRegistration = () => {
  const { user } = useSelector((state) => state.auth);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('address', address);
    formData.append('pincode', pincode);
    formData.append('licenseNumber', licenseNumber);
    if (documentFile) {
      formData.append('document', documentFile);
    }

    try {
      await api.post('/api/shops', formData);

      setSuccess('Business Tie-up request submitted successfully for admin approval!');
      setCategory('');
      setSubCategory('');
      setName('');
      setAddress('');
      setLicenseNumber('');
      setDocumentFile(null);
      const fileInput = document.getElementById('shop-document-file');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit business tie-up request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#034ea2]">New Business Tie-up</h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Register a new partner business for admin approval.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg flex items-center gap-2 font-bold">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 rounded-lg flex items-center gap-2 font-bold">
            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Select Category */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Select Category *</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
            >
              <option value="">Choose Category</option>
              <option value="Grocery">Grocery</option>
              <option value="Hardware">Hardware</option>
              <option value="Medical">Medical</option>
              <option value="Clothing">Clothing</option>
              <option value="Stationery">Stationery</option>
              <option value="Electronics">Electronics</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Sub-category / Type */}
          <div>
            <input
              type="text"
              required
              placeholder="Sub-category / Type *"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Business Name */}
          <div>
            <input
              type="text"
              required
              placeholder="Business Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Pincode */}
          <div>
            <input
              type="text"
              required
              placeholder="Pincode *"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Full Address */}
          <div>
            <textarea
              required
              rows={2}
              placeholder="Full Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Business License Number (Optional) */}
          <div>
            <input
              type="text"
              placeholder="Business License Number (Optional)"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Upload Copy / Proof */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-slate-700">Business License Copy / Proof</label>
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition group">
              <div className="w-10 h-10 bg-[#034ea2] text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#034ea2]">
                {documentFile ? documentFile.name : 'Select image from Gallery'}
              </span>
              <input
                type="file"
                id="shop-document-file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#034ea2] hover:bg-[#023875] text-white font-bold py-3.5 rounded-lg text-sm shadow-md transition duration-200 mt-4"
          >
            {loading ? 'Submitting Request...' : 'Submit Request'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ShopRegistration;
