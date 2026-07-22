import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Upload, Award, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const locationData = {
  'Tamil Nadu': {
    districts: {
      'Ariyalur District': ['Ariyalur Division', 'Udayarpalayam Division'],
      'Chengalpattu District': ['Chengalpattu Division', 'Madurantakam Division', 'Tambaram Division'],
      'Chennai District': ['Chennai Division', 'Chennai North Division', 'Chennai South Division'],
      'Coimbatore District': ['Chennai Division', 'Coimbatore North Division', 'Coimbatore South Division'],
      'Cuddalore District': ['Cuddalore Division', 'Chidambaram Division', 'Vriddhachalam Division'],
      'Dharmapuri District': ['Dharmapuri Division', 'Harur Division'],
      'Dindigul District': ['Dindigul Division', 'Kodaikanal Division', 'Palani Division'],
      'Erode District': ['Erode Division', 'Gobichettipalayam Division'],
      'Kallakurichi District': ['Kallakurichi Division', 'Tirukkoyilur Division'],
      'Kanchipuram District': ['Kanchipuram Division', 'Sriperumbudur Division'],
      'Kanniyakumari District': ['Nagercoil Division', 'Padmanabhapuram Division'],
      'Karur District': ['Karur Division', 'Kulithalai Division'],
      'Krishnagiri District': ['Krishnagiri Division', 'Hosur Division'],
      'Madurai District': ['Madurai Division', 'Madurai North Division', 'Madurai South Division'],
      'Mayiladuthurai District': ['Mayiladuthurai Division', 'Sirkazhi Division'],
      'Nagapattinam District': ['Nagapattinam Division', 'Vedaranyam Division'],
      'Namakkal District': ['Namakkal Division', 'Tiruchengode Division'],
      'Nilgiris District': ['Coonoor Division', 'Gudalur Division', 'Ootacamund Division'],
      'Perambalur District': ['Perambalur Division'],
      'Pudukkottai District': ['Pudukkottai Division', 'Aranthangi Division', 'Iluppur Division'],
      'Ramanathapuram District': ['Ramanathapuram Division', 'Paramakudi Division'],
      'Ranipet District': ['Ranipet Division', 'Arakkonam Division'],
      'Salem District': ['Salem East Division', 'Salem West Division', 'Attur Division', 'Mettur Division'],
      'Sivagangai District': ['Sivagangai Division', 'Devakottai Division'],
      'Tenkasi District': ['Tenkasi Division', 'Sankarankovil Division'],
      'Thanjavur District': ['Thanjavur Division', 'Kumbakonam Division', 'Pattukkottai Division'],
      'Theni District': ['Theni Division', 'Periyakulam Division'],
      'Thoothukudi District': ['Thoothukudi Division', 'Kovilpatti Division', 'Tiruchendur Division'],
      'Tiruchirappalli District': ['Tiruchirappalli Division', 'Lalgudi Division', 'Musiri Division', 'Srirangam Division'],
      'Tirunelveli District': ['Tirunelveli Division', 'Cheranmahadevi Division'],
      'Tirupathur District': ['Tirupathur Division', 'Vaniyambadi Division'],
      'Tiruppur District': ['Tiruppur Division', 'Dharapuram Division', 'Udumalaipettai Division'],
      'Tiruvallur District': ['Tiruvallur Division', 'Ponneri Division', 'Tiruttani Division'],
      'Tiruvannamalai District': ['Tiruvannamalai Division', 'Arani Division', 'Cheyyar Division'],
      'Tiruvarur District': ['Tiruvarur Division', 'Mannargudi Division'],
      'Vellore District': ['Vellore Division', 'Gudiyatham Division'],
      'Viluppuram District': ['Viluppuram Division', 'Tindivanam Division'],
      'Virudhunagar District': ['Virudhunagar Division', 'Aruppukkottai Division', 'Sivakasi Division']
    }
  },
  'Kerala': {
    districts: {
      'Palakkad District': ['Palakkad Division', 'Mannarkkad Division'],
      'Ernakulam District': ['Kochi Division', 'Muvattupuzha Division'],
    }
  },
  'Karnataka': {
    districts: {
      'Bangalore Urban': ['Bangalore North', 'Bangalore South'],
      'Mysore District': ['Mysore Division', 'Hunsur Division'],
    }
  }
};

const pincodeLookupData = {
  '641001': { state: 'Tamil Nadu', district: 'Coimbatore District', division: 'Chennai Division', areas: ['Coimbatore Main', 'Coimbatore Central'] },
  '641002': { state: 'Tamil Nadu', district: 'Coimbatore District', division: 'Chennai Division', areas: ['RS Puram', 'Coimbatore West'] },
  '600001': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division', areas: ['Chennai Center', 'Fort St George'] },
  '600002': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division', areas: ['Mount Road', 'Anna Salai'] },
  '600040': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division', areas: ['Anna Nagar', 'Shenoy Nagar'] },
  '625001': { state: 'Tamil Nadu', district: 'Madurai District', division: 'Madurai Division', areas: ['Madurai City', 'Meenakshi Temple'] },
  '636112': { state: 'Tamil Nadu', district: 'Salem District', division: 'Salem East Division', areas: ['Thalaivasal', 'Deviyakurichi', 'Navakurichi'] },
};

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Pincode Agent');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [division, setDivision] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState('');
  const [kycFile, setKycFile] = useState(null);
  
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePincodeChange = async (val) => {
    setPincode(val);
    setSelectedPostOffice('');
    if (val.length === 6) {
      setPincodeLoading(true);
      setError('');
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${val}`);
        if (response.data && response.data[0] && response.data[0].Status === 'Success') {
          const postOffices = response.data[0].PostOffice || [];
          const postOffice = postOffices[0];
          if (postOffice) {
            setStateName(postOffice.State || 'Tamil Nadu');
            const dist = postOffice.District;
            setDistrict(dist ? (dist.toLowerCase().endsWith('district') ? dist : `${dist} District`) : '');
            const div = postOffice.Division;
            setDivision(div ? (div.toLowerCase().endsWith('division') ? div : `${div} Division`) : '');
            
            const areaNames = postOffices.map(po => po.Name);
            setAreas(areaNames);
            return;
          }
        }
        
        // Fallback to local dictionary
        const matched = pincodeLookupData[val];
        if (matched) {
          setStateName(matched.state);
          setDistrict(matched.district);
          setDivision(matched.division);
          setAreas(matched.areas || []);
        } else {
          setStateName('');
          setDistrict('');
          setDivision('');
          setAreas([]);
        }
      } catch (err) {
        console.warn('Live lookup failed, using local fallback:', err);
        const matched = pincodeLookupData[val];
        if (matched) {
          setStateName(matched.state);
          setDistrict(matched.district);
          setDivision(matched.division);
          setAreas(matched.areas || []);
        } else {
          setStateName('');
          setDistrict('');
          setDivision('');
          setAreas([]);
        }
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setStateName('');
      setDistrict('');
      setDivision('');
      setAreas([]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Form validations
    if (role === 'Pincode Agent' && (!pincode || pincode.length !== 6 || !stateName)) {
      setError('Please enter a valid 6-digit Pincode with resolved location details.');
      setLoading(false);
      return;
    }
    if (role === 'Pincode Agent' && !selectedPostOffice) {
      setError('Please select your Post Office/Local Area.');
      setLoading(false);
      return;
    }
    if (role === 'State Agent' && !stateName) {
      setError('Please select a State.');
      setLoading(false);
      return;
    }
    if (role === 'District Agent' && (!stateName || !district)) {
      setError('Please select State and District.');
      setLoading(false);
      return;
    }
    if (role === 'Divisional Agent' && (!stateName || !district || !division)) {
      setError('Please select State, District and Division.');
      setLoading(false);
      return;
    }
    if (!kycFile) {
      setError('Please upload your KYC Verification Document (Aadhaar/PAN/GST).');
      setLoading(false);
      return;
    }

    try {
      // Simulate/Trigger API registration
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        phone,
        password,
        role,
        pincode: role === 'Pincode Agent' ? pincode : '',
        state: stateName,
        district: (role !== 'State Agent') ? district : '',
        division: (role === 'Divisional Agent' || role === 'Pincode Agent') ? division : '',
        postOffice: role === 'Pincode Agent' ? selectedPostOffice : '',
        kycAttachedName: kycFile.name
      });

      setSuccess(response.data.message || 'Registration successful!');
      
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setPincode('');
      setStateName('');
      setDistrict('');
      setDivision('');
      setAreas([]);
      setSelectedPostOffice('');
      setKycFile(null);

      // Redirect after brief delay
      setTimeout(() => {
        navigate('/login');
      }, 3500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setKycFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-forge-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-forge-accent opacity-20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-forge-gold opacity-10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-lg bg-forge-dark/80 backdrop-blur-md border border-forge-card/50 rounded-2xl shadow-2xl p-8 relative z-10 my-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-forge-card border border-forge-gold/30 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Award className="w-8 h-8 text-forge-gold" />
          </div>
          <h1 className="text-xl font-extrabold tracking-wider text-white">
            JOIN FORGE INDIA
          </h1>
          <p className="text-xs text-forge-gold font-semibold uppercase tracking-widest mt-1">
            Agent Application Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-800/80 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 p-6 rounded-xl text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold">Application Received!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {success}
            </p>
            <p className="text-[11px] text-forge-gold font-bold animate-pulse">
              Redirecting you to the secure login screen...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-grayText">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-grayText">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-grayText">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-forge-grayText">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Role dropdown */}
            <div>
              <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                Requested Agent Role
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPincode('');
                  setDistrict('');
                  setDivision('');
                }}
                className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white px-3 py-2.5 rounded-lg text-sm outline-none transition"
              >
                <option value="Pincode Agent" className="bg-forge-dark">Pincode Agent</option>
                <option value="District Agent" className="bg-forge-dark">District Agent</option>
                <option value="Divisional Agent" className="bg-forge-dark">Divisional Agent</option>
                <option value="State Agent" className="bg-forge-dark">State Agent</option>
              </select>
            </div>

            {/* Location selection logic based on Role */}
            {role === 'State Agent' && (
              <div>
                <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                  Select State
                </label>
                <select
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white px-3 py-2.5 rounded-lg text-sm outline-none transition"
                >
                  <option value="" className="bg-forge-dark">-- Choose State --</option>
                  {Object.keys(locationData).map((st) => (
                    <option key={st} value={st} className="bg-forge-dark">{st}</option>
                  ))}
                </select>
              </div>
            )}

            {role === 'District Agent' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                    Select State
                  </label>
                  <select
                    required
                    value={stateName}
                    onChange={(e) => {
                      setStateName(e.target.value);
                      setDistrict('');
                    }}
                    className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white px-3 py-2.5 rounded-lg text-sm outline-none transition"
                  >
                    <option value="" className="bg-forge-dark">-- Choose State --</option>
                    {Object.keys(locationData).map((st) => (
                      <option key={st} value={st} className="bg-forge-dark">{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                    Select District
                  </label>
                  <select
                    required
                    value={district}
                    disabled={!stateName}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={`w-full bg-forge-card/50 border border-forge-card text-white px-3 py-2.5 rounded-lg text-sm outline-none transition ${
                      !stateName ? 'opacity-55 cursor-not-allowed' : 'hover:border-forge-gold/30 focus:border-forge-gold'
                    }`}
                  >
                    <option value="" className="bg-forge-dark">-- Choose District --</option>
                    {stateName && Object.keys(locationData[stateName]?.districts || {}).map((dist) => (
                      <option key={dist} value={dist} className="bg-forge-dark">{dist}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {role === 'Divisional Agent' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                    Select State
                  </label>
                  <select
                    required
                    value={stateName}
                    onChange={(e) => {
                      setStateName(e.target.value);
                      setDistrict('');
                      setDivision('');
                    }}
                    className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white px-3 py-2.5 rounded-lg text-sm outline-none transition"
                  >
                    <option value="" className="bg-forge-dark">-- Choose State --</option>
                    {Object.keys(locationData).map((st) => (
                      <option key={st} value={st} className="bg-forge-dark">{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                    Select District
                  </label>
                  <select
                    required
                    value={district}
                    disabled={!stateName}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setDivision('');
                    }}
                    className={`w-full bg-forge-card/50 border border-forge-card text-white px-3 py-2.5 rounded-lg text-sm outline-none transition ${
                      !stateName ? 'opacity-55 cursor-not-allowed' : 'hover:border-forge-gold/30 focus:border-forge-gold'
                    }`}
                  >
                    <option value="" className="bg-forge-dark">-- Choose District --</option>
                    {stateName && Object.keys(locationData[stateName]?.districts || {}).map((dist) => (
                      <option key={dist} value={dist} className="bg-forge-dark">{dist}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                    Select Division
                  </label>
                  <select
                    required
                    value={division}
                    disabled={!district}
                    onChange={(e) => setDivision(e.target.value)}
                    className={`w-full bg-forge-card/50 border border-forge-card text-white px-3 py-2.5 rounded-lg text-sm outline-none transition ${
                      !district ? 'opacity-55 cursor-not-allowed' : 'hover:border-forge-gold/30 focus:border-forge-gold'
                    }`}
                  >
                    <option value="" className="bg-forge-dark">-- Choose Division --</option>
                    {stateName && district && (locationData[stateName]?.districts[district] || []).map((div) => (
                      <option key={div} value={div} className="bg-forge-dark">{div}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {role === 'Pincode Agent' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                    Enter Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 636112"
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white px-3.5 py-2.5 rounded-lg text-sm outline-none transition"
                  />
                </div>

                {pincodeLoading && (
                  <p className="text-[11px] text-forge-gold font-bold animate-pulse mt-2">
                    Resolving area details from Indian Postal Server...
                  </p>
                )}

                {pincode.length === 6 && !pincodeLoading && (
                  <div className="bg-forge-card/30 border border-forge-card p-4 rounded-xl space-y-3">
                    <h4 className="text-[11px] font-black text-forge-gold uppercase tracking-wider">Resolved Area Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-forge-grayText">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">State</span>
                        <input
                          type="text"
                          readOnly
                          value={stateName || 'Not Found'}
                          className="w-full bg-forge-dark/50 border border-forge-card text-white/90 px-3 py-2 rounded-lg outline-none cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">District</span>
                        <input
                          type="text"
                          readOnly
                          value={district || 'Not Found'}
                          className="w-full bg-forge-dark/50 border border-forge-card text-white/90 px-3 py-2 rounded-lg outline-none cursor-not-allowed"
                        />
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Division</span>
                        <input
                          type="text"
                          readOnly
                          value={division || 'Not Found'}
                          className="w-full bg-forge-dark/50 border border-forge-card text-white/90 px-3 py-2 rounded-lg outline-none cursor-not-allowed"
                        />
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Select Post Office</span>
                        <select
                          required
                          value={selectedPostOffice}
                          onChange={(e) => setSelectedPostOffice(e.target.value)}
                          className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white px-3 py-2.5 rounded-lg text-sm outline-none transition"
                        >
                          <option value="" className="bg-forge-dark">
                            Select Post Office ({areas.length} found)
                          </option>
                          {areas.map((area) => (
                            <option key={area} value={area} className="bg-forge-dark">
                              {area}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {!stateName && (
                      <p className="text-[10px] text-rose-400 font-semibold mt-1">
                        * Pincode could not be resolved. Please double check the code.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* KYC File upload */}
            <div>
              <label className="block text-xs font-semibold text-forge-grayText uppercase tracking-wider mb-1.5">
                KYC Verification Document (PDF/Image)
              </label>
              <div className="border-2 border-dashed border-forge-card hover:border-forge-gold/40 rounded-lg p-4 text-center cursor-pointer transition relative">
                <input
                  type="file"
                  required
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-forge-grayText mx-auto mb-2" />
                {kycFile ? (
                  <div className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                    <FileCheck className="w-4.5 h-4.5" />
                    {kycFile.name}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Click to upload Aadhaar, PAN Card, or GST Profile</p>
                    <p className="text-[10px] text-slate-500 mt-1">Accepts PDF, JPG, PNG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-forge-gold to-yellow-600 hover:from-yellow-600 hover:to-forge-gold text-forge-dark font-bold py-3 rounded-lg shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98] transition-all duration-200 mt-2 text-sm"
            >
              {loading ? 'Submitting Details...' : 'Submit Registration'}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-forge-grayText hover:text-white hover:underline transition">
                Already registered? Back to Login
              </Link>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
