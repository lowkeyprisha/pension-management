import { useState } from 'react';
import { UserPlus, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const fields = [
  { section: 'Personal details', items: [
    { name: 'name', label: 'Full name', required: true, placeholder: 'e.g. Ramesh Kumar Sharma' },
    { name: 'fathersName', label: "Father's name", placeholder: 'e.g. Suresh Kumar' },
    { name: 'dob', label: 'Date of birth', type: 'date' },
    { name: 'dor', label: 'Date of retirement', required: true, type: 'date' },
    { name: 'phoneNo', label: 'Phone number', placeholder: '10-digit mobile' },
    { name: 'address', label: 'Address', placeholder: 'Full residential address', full: true },
  ]},
  { section: 'Identity & financial', items: [
    { name: 'aadhaarNo', label: 'Aadhaar number', placeholder: '12-digit number' },
    { name: 'panNo', label: 'PAN number', placeholder: 'e.g. ABCDE1234F' },
    { name: 'ppoNo', label: 'PPO number', required: true, placeholder: 'Pension Payment Order No.' },
    { name: 'bankAccountNo', label: 'Bank account no.', placeholder: 'Account number' },
    { name: 'ifscCode', label: 'IFSC code', placeholder: 'e.g. SBIN0001234' },
    { name: 'basePensionAmount', label: 'Base pension amount (₹)', required: true, type: 'number', placeholder: 'Monthly entitlement' },
  ]},
  { section: 'Nominee & status', items: [
    { name: 'nomineeName', label: 'Nominee name', placeholder: 'Family pensioner name' },
    { name: 'pensionStartDate', label: 'Pension start date', type: 'date', placeholder: 'Auto-filled from DOR' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Suspended', 'Deceased'] },
  ]},
];

export default function RegisterPensioner() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(null);
    try {
      const res = await api.post('/pensioners', form);
      setSuccess(res.data.data);
      setForm({});
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-5">Register new pensioner</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Pensioner registered successfully!</p>
            <p className="text-xs text-green-600">ID: {success.pensionerId} · {success.name}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        {fields.map(({ section, items }) => (
          <div key={section}>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{section}</h2>
            <div className="grid grid-cols-2 gap-4">
              {items.map(({ name, label, required, type = 'text', placeholder, options, full }) => (
                <div key={name} className={full ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    {label}{required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  {type === 'select' ? (
                    <select
                      name={name}
                      value={form[name] || 'Active'}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                    >
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={form[name] || ''}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setForm({})} className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            <UserPlus size={15} />
            {loading ? 'Registering…' : 'Register pensioner'}
          </button>
        </div>
      </div>
    </div>
  );
}
