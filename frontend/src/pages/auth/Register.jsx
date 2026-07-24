import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Upload, Award, FileCheck, CheckCircle2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
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

const divisionPincodesMap = {
  // Salem District
  'Attur Division': ['636102', '636107', '636108', '636109', '636112', '636113', '636114', '636116', '636121', '636122', '636141'],
  'Salem East Division': ['636001', '636002', '636003', '636006', '636014', '636112'],
  'Salem West Division': ['636004', '636005', '636007', '636008', '636009', '636011', '636307'],
  'Mettur Division': ['636401', '636402', '636451', '636452', '636453', '636454'],
  // Chennai District
  'Chennai Division': ['600001', '600002', '600003', '600004', '600005', '600006', '600014', '600018', '600028'],
  'Chennai North Division': ['600011', '600012', '600021', '600039', '600051', '600081'],
  'Chennai South Division': ['600020', '600032', '600041', '600042', '600078', '600096', '600113'],
  // Chengalpattu & Kanchipuram
  'Chengalpattu Division': ['603001', '603002', '603003', '603111'],
  'Tambaram Division': ['600045', '600047', '600059', '600064', '600073'],
  'Kanchipuram Division': ['631501', '631502', '631503'],
  // Coimbatore District
  'Coimbatore North Division': ['641001', '641002', '641006', '641012', '641029', '641030'],
  'Coimbatore South Division': ['641003', '641004', '641005', '641008', '641021', '641023'],
  // Madurai District
  'Madurai Division': ['625001', '625002', '625003', '625008', '625009', '625010'],
  'Madurai North Division': ['625007', '625014', '625018'],
  'Madurai South Division': ['625004', '625005', '625006'],
  // Erode District
  'Erode Division': ['638001', '638002', '638003', '638009', '638011'],
  'Gobichettipalayam Division': ['638452', '638453', '638476', '638478'],
  // Namakkal District
  'Namakkal Division': ['637001', '637002', '637003', '637019'],
  'Tiruchengode Division': ['637211', '637212', '637214', '637215'],
  // Dharmapuri & Krishnagiri
  'Dharmapuri Division': ['636701', '636702', '636703', '636705'],
  'Harur Division': ['636903', '636904', '636906'],
  'Hosur Division': ['635109', '635126', '635130'],
  'Krishnagiri Division': ['635001', '635002', '635101'],
  // Tiruchirappalli & Thanjavur
  'Tiruchirappalli Division': ['620001', '620002', '620003', '620008'],
  'Srirangam Division': ['620006', '620009', '620012'],
  'Thanjavur Division': ['613001', '613002', '613005'],
  'Kumbakonam Division': ['612001', '612002', '612101'],
  // Kallakurichi District
  'Kallakurichi Division': ['606202', '606201', '606203', '606204', '606206', '606207', '606213'],
  'Tirukkoyilur Division': ['605757', '605751', '605752', '605753', '605754', '605755'],
  // Tirunelveli & Vellore
  'Tirunelveli Division': ['627001', '627002', '627003', '627005'],
  'Vellore Division': ['632001', '632002', '632004', '632009'],
};

const pincodeLookupData = {
  '641001': { state: 'Tamil Nadu', district: 'Coimbatore District', division: 'Coimbatore North Division', areas: ['Coimbatore Main', 'Coimbatore Central'] },
  '641002': { state: 'Tamil Nadu', district: 'Coimbatore District', division: 'Coimbatore North Division', areas: ['RS Puram', 'Coimbatore West'] },
  '600001': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division', areas: ['Chennai Center', 'Fort St George'] },
  '600002': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division', areas: ['Mount Road', 'Anna Salai'] },
  '600040': { state: 'Tamil Nadu', district: 'Chennai District', division: 'Chennai Division', areas: ['Anna Nagar', 'Shenoy Nagar'] },
  '625001': { state: 'Tamil Nadu', district: 'Madurai District', division: 'Madurai Division', areas: ['Madurai City', 'Meenakshi Temple'] },
  // Kallakurichi Division pincode lookups
  '606202': { state: 'Tamil Nadu', district: 'Kallakurichi District', division: 'Kallakurichi Division', areas: ['Kallakurichi Main', 'Bus Stand Area', 'Market Square', 'Kachirayapalayam Road'] },
  '606201': { state: 'Tamil Nadu', district: 'Kallakurichi District', division: 'Kallakurichi Division', areas: ['Chinnasalem', 'Karanavoor', 'Railway Station Area'] },
  '606203': { state: 'Tamil Nadu', district: 'Kallakurichi District', division: 'Kallakurichi Division', areas: ['Sankarapuram', 'Vadakanandal', 'Moortham'] },
  '606204': { state: 'Tamil Nadu', district: 'Kallakurichi District', division: 'Kallakurichi Division', areas: ['Kachirayapalayam', 'Kalvarayan Hills Foothills', 'Akcharapakkam'] },
  '606206': { state: 'Tamil Nadu', district: 'Kallakurichi District', division: 'Kallakurichi Division', areas: ['Rishivandiyam', 'Moorangam', 'Pakkam'] },
  '606207': { state: 'Tamil Nadu', district: 'Kallakurichi District', division: 'Kallakurichi Division', areas: ['Tyagadurgam', 'Nagalur', 'Asokalay'] },
  '606213': { state: 'Tamil Nadu', district: 'Kallakurichi District', division: 'Kallakurichi Division', areas: ['Kallakurichi South', 'Siruvangur', 'Neelamangalam'] },
  // Attur Division pincode lookups
  '636102': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Attur Main', 'Attur West', 'Narasingapuram'] },
  '636107': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Ethapur', 'Kallanatham'] },
  '636108': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Mullaivadi', 'Manjini'] },
  '636109': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Peddanaickenpalayam', 'P.N. Palayam East'] },
  '636112': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Thalaivasal', 'Deviyakurichi', 'Navakurichi'] },
  '636113': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Talaivasal South', 'Siruvachur'] },
  '636114': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Gangavalli', 'Pachamalai'] },
  '636116': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Sentharapatti', 'Kottaipalayam'] },
  '636121': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Tammampatti', 'Sentharapatti North'] },
  '636122': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Ulipuram', 'Gangavalli East'] },
  '636141': { state: 'Tamil Nadu', district: 'Salem District', division: 'Attur Division', areas: ['Valapady', 'Belur', 'Muthampatti'] },
};

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('State Agent');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [division, setDivision] = useState('');
  const [region, setRegion] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState('');
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [bankFile, setBankFile] = useState(null);
  const [checkLeafFile, setCheckLeafFile] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [certificationsFile, setCertificationsFile] = useState(null);
  
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePincodeVerify = async () => {
    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit Pincode.');
      return;
    }
    setPincodeLoading(true);
    setError('');
    setIsVerified(false);
    setSelectedPostOffice('');
    setRegion('');
    setDeliveryStatus('');
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data && response.data[0] && response.data[0].Status === 'Success') {
        const postOffices = response.data[0].PostOffice || [];
        const postOffice = postOffices[0];
        if (postOffice) {
          setStateName(postOffice.State || 'Tamil Nadu');
          const dist = postOffice.District;
          setDistrict(dist ? (dist.toLowerCase().endsWith('district') ? dist : `${dist} District`) : '');
          const div = postOffice.Division;
          setDivision(div ? (div.toLowerCase().endsWith('division') ? div : `${div} Division`) : '');
          setRegion(postOffice.Region || 'Coimbatore');
          setDeliveryStatus(postOffice.DeliveryStatus || 'Delivery');
          
          const areaNames = postOffices.map(po => po.Name);
          setAreas(areaNames);
          setSelectedPostOffice(''); // do not default select
          setIsVerified(true);
          return;
        }
      }
      
      // Fallback to local dictionary
      const matched = pincodeLookupData[pincode];
      if (matched) {
        setStateName(matched.state);
        setDistrict(matched.district);
        setDivision(matched.division);
        setRegion('Coimbatore');
        setDeliveryStatus('Delivery');
        setAreas(matched.areas || []);
        setSelectedPostOffice(''); // do not default select
        setIsVerified(true);
      } else {
        setStateName('Tamil Nadu');
        setDistrict('Salem District');
        setDivision('Salem West Division');
        setRegion('Coimbatore');
        setDeliveryStatus('Delivery');
        setAreas(['Fairlands SO', 'Main Market', 'Central Postal Hub']);
        setSelectedPostOffice(''); // do not default select
        setIsVerified(true);
      }
    } catch (err) {
      console.warn('Live lookup failed, using local fallback:', err);
      const matched = pincodeLookupData[pincode];
      if (matched) {
        setStateName(matched.state);
        setDistrict(matched.district);
        setDivision(matched.division);
        setRegion('Coimbatore');
        setDeliveryStatus('Delivery');
        setAreas(matched.areas || []);
        setSelectedPostOffice(''); // do not default select
        setIsVerified(true);
      } else {
        setStateName('Tamil Nadu');
        setDistrict('Salem District');
        setDivision('Salem West Division');
        setRegion('Coimbatore');
        setDeliveryStatus('Delivery');
        setAreas(['Fairlands SO', 'Main Market', 'Central Postal Hub']);
        setSelectedPostOffice(''); // do not default select
        setIsVerified(true);
      }
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Form validations
    if (role === 'Pincode Agent' && (!pincode || pincode.length !== 6 || !stateName)) {
      setError('Please select a valid 6-digit Pincode.');
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
    if (!aadharFile || !panFile || !bankFile || !checkLeafFile || !certificationsFile) {
      setError('Please upload all 5 required onboarding documents (Aadhaar, PAN, Bank Details, Signed Check Leaf, and School/College Certifications).');
      setLoading(false);
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the Terms and Conditions to proceed.');
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
        aadharAttachedName: aadharFile.name,
        panAttachedName: panFile.name,
        bankAttachedName: bankFile.name,
        checkLeafAttachedName: checkLeafFile.name,
        certificationsAttachedName: certificationsFile.name
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
      setRegion('');
      setDeliveryStatus('');
      setAreas([]);
      setSelectedPostOffice('');
      setAadharFile(null);
      setPanFile(null);
      setBankFile(null);
      setCheckLeafFile(null);
      setCertificationsFile(null);
      setAcceptedTerms(false);

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
          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* STEP 1: Requested Agent Role Selection */}
            <div>
              <label className="block text-xs font-bold text-forge-gold uppercase tracking-wider mb-1.5">
                Step 1: Select Requested Agent Role
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setIsVerified(false);
                  setPincode('');
                  setStateName('');
                  setDistrict('');
                  setDivision('');
                  setAreas([]);
                  setSelectedPostOffice('');
                }}
                className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white px-3.5 py-2.5 rounded-lg text-sm outline-none transition font-semibold"
              >
                <option value="State Agent" className="bg-forge-dark">State Agent</option>
                <option value="District Agent" className="bg-forge-dark">District Agent</option>
                <option value="Divisional Agent" className="bg-forge-dark">Divisional Agent</option>
                <option value="Pincode Agent" className="bg-forge-dark">Pincode Agent</option>
              </select>
            </div>

            {/* STEP 2: Unified PIN Code Verification Flow */}
            <div className="bg-forge-card/20 border border-forge-card/60 p-5 rounded-2xl space-y-4">
              <label className="block text-xs font-bold text-forge-gold uppercase tracking-wider mb-1">
                Step 2: Pincode Master
              </label>
              
              <div>
                <label className="block text-[10px] font-black text-forge-grayText uppercase tracking-widest mb-1.5">
                  Enter 6-Digit Pincode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 636112"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ''));
                      setIsVerified(false);
                      setAreas([]);
                      setSelectedPostOffice('');
                    }}
                    className="flex-1 bg-forge-card/50 border border-forge-card focus:border-forge-gold text-white px-4 py-2.5 rounded-xl text-base font-extrabold tracking-wider outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={handlePincodeVerify}
                    disabled={pincodeLoading || pincode.length !== 6}
                    className="bg-forge-gold hover:bg-forge-gold/90 text-forge-dark font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {pincodeLoading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>

              {pincodeLoading && (
                <p className="text-[11px] text-forge-gold font-bold animate-pulse mt-1">
                  Resolving area details from Indian Postal Server...
                </p>
              )}

              {isVerified && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Pincode Cover Areas List (Pincode Agent only) */}
                  {role === 'Pincode Agent' && (
                    <div className="space-y-2.5">
                      <label className="block text-[10px] font-black text-forge-grayText uppercase tracking-widest">
                        Pincode Cover Areas
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-forge-dark/30 p-3 rounded-xl border border-forge-card/50 max-h-48 overflow-y-auto">
                        {areas.map((po) => (
                          <div
                            key={po}
                            className="px-3 py-2 bg-forge-card/45 text-slate-300 rounded-lg text-xs font-bold border border-forge-card/40"
                          >
                            {po}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pincode Available Green Badge */}
                  <div className="flex justify-center">
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      ✓ Pincode Available
                    </span>
                  </div>

                  {/* LOCATION DETAILS CARD */}
                  <div className="bg-forge-dark/40 border border-slate-700/50 rounded-2xl p-5 space-y-3.5 shadow-md">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block border-b border-slate-800 pb-1 mb-2">Location Details</span>
                    
                    {(role === 'District Agent' || role === 'Divisional Agent' || role === 'Pincode Agent') && (
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-500">District:</span>
                        <span className="text-white font-extrabold">{district || 'N/A'}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">State:</span>
                      <span className="text-white font-extrabold">{stateName || 'N/A'}</span>
                    </div>

                    {(role === 'Divisional Agent' || role === 'Pincode Agent') && (
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-500">Division:</span>
                        <span className="text-white font-extrabold">{division || 'N/A'}</span>
                      </div>
                    )}

                    {region && (
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-500">Region:</span>
                        <span className="text-white font-extrabold">{region}</span>
                      </div>
                    )}

                    {deliveryStatus && (
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-500">Delivery Status:</span>
                        <span className="text-white font-extrabold">{deliveryStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: Fill Personal Details */}
            <div className="space-y-4 border-t border-forge-card/40 pt-3">
              <label className="block text-xs font-bold text-forge-gold uppercase tracking-wider">
                Step 3: Personal Details
              </label>

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
                      name="agentFullName"
                      autoComplete="name"
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
                      name="agentEmail"
                      autoComplete="email"
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
                      name="agentPhone"
                      autoComplete="tel"
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
                      type={showPassword ? "text" : "password"}
                      name="agentPassword"
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-forge-card/50 border border-forge-card hover:border-forge-gold/30 focus:border-forge-gold text-white pl-9 pr-9 py-2.5 rounded-lg text-sm outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition cursor-pointer"
                      title={showPassword ? "Hide Password" : "Show Password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: Onboarding Documents upload */}
            <div className="border-t border-forge-card/40 pt-4 space-y-3">
              <label className="block text-xs font-bold text-forge-gold uppercase tracking-wider mb-2">
                Step 4: Required Onboarding Documents (PNG or PDF)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Aadhaar */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Aadhaar Card</span>
                  <div className={`relative border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition ${
                    aadharFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-forge-card hover:border-forge-gold/50 bg-forge-card/10'
                  }`}>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,.pdf"
                      required
                      onChange={(e) => setAadharFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Upload className={`w-4 h-4 ${aadharFile ? 'text-emerald-400' : 'text-forge-gold'}`} />
                      <span className="text-[11px] font-semibold truncate max-w-full text-slate-300 px-1">
                        {aadharFile ? aadharFile.name : 'Upload Aadhaar'}
                      </span>
                      <span className="text-[9px] text-forge-grayText">PNG, JPG, PDF (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                {/* 2. PAN */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">PAN Card</span>
                  <div className={`relative border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition ${
                    panFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-forge-card hover:border-forge-gold/50 bg-forge-card/10'
                  }`}>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,.pdf"
                      required
                      onChange={(e) => setPanFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Upload className={`w-4 h-4 ${panFile ? 'text-emerald-400' : 'text-forge-gold'}`} />
                      <span className="text-[11px] font-semibold truncate max-w-full text-slate-300 px-1">
                        {panFile ? panFile.name : 'Upload PAN'}
                      </span>
                      <span className="text-[9px] text-forge-grayText">PNG, JPG, PDF (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Bank Details */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Bank Details</span>
                  <div className={`relative border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition ${
                    bankFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-forge-card hover:border-forge-gold/50 bg-forge-card/10'
                  }`}>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,.pdf"
                      required
                      onChange={(e) => setBankFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Upload className={`w-4 h-4 ${bankFile ? 'text-emerald-400' : 'text-forge-gold'}`} />
                      <span className="text-[11px] font-semibold truncate max-w-full text-slate-300 px-1">
                        {bankFile ? bankFile.name : 'Upload Bank Passbook'}
                      </span>
                      <span className="text-[9px] text-forge-grayText">PNG, JPG, PDF (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                {/* 4. Signed Check Leaf */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Sign Check Leaf</span>
                  <div className={`relative border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition ${
                    checkLeafFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-forge-card hover:border-forge-gold/50 bg-forge-card/10'
                  }`}>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,.pdf"
                      required
                      onChange={(e) => setCheckLeafFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Upload className={`w-4 h-4 ${checkLeafFile ? 'text-emerald-400' : 'text-forge-gold'}`} />
                      <span className="text-[11px] font-semibold truncate max-w-full text-slate-300 px-1">
                        {checkLeafFile ? checkLeafFile.name : 'Upload Signed Check Leaf'}
                      </span>
                      <span className="text-[9px] text-forge-grayText">PNG, JPG, PDF (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                {/* 5. School & College Certifications */}
                <div className="space-y-1 sm:col-span-2">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">School & College Certifications</span>
                  <div className={`relative border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition ${
                    certificationsFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-forge-card hover:border-forge-gold/50 bg-forge-card/10'
                  }`}>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,.pdf"
                      required
                      onChange={(e) => setCertificationsFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Upload className={`w-4 h-4 ${certificationsFile ? 'text-emerald-400' : 'text-forge-gold'}`} />
                      <span className="text-[11px] font-semibold truncate max-w-full text-slate-300 px-1">
                        {certificationsFile ? certificationsFile.name : 'Upload Certifications'}
                      </span>
                      <span className="text-[9px] text-forge-grayText">PNG, JPG, PDF (Max 5MB)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start gap-2.5 pt-3 p-1">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-forge-gold bg-forge-card border-forge-card focus:ring-0 focus:ring-offset-0 mt-0.5 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="acceptTerms" className="text-xs text-slate-300 font-semibold cursor-pointer select-none leading-relaxed">
                  I agree to the <span className="text-forge-gold underline hover:text-amber-400">Terms & Conditions</span> and authorize Forge India to verify the uploaded credentials.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forge-gold hover:bg-amber-400 text-forge-dark font-extrabold py-3 px-4 rounded-xl shadow-lg transition transform active:scale-98 disabled:opacity-50 text-sm mt-4 uppercase tracking-wider"
            >
              {loading ? 'Submitting Application...' : 'Submit Registration'}
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
