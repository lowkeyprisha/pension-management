import { useEffect, useState } from 'react';
import { Users, CheckCircle, Banknote, TrendingUp } from 'lucide-react';
import api from '../api/axios';

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Suspended: 'bg-amber-100 text-amber-700',
  Deceased: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [pensioners, setPensioners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pensioners').then((r) => {
      setPensioners(r.data.data);
      setLoading(false);
    });
  }, []);

  const active = pensioners.filter((p) => p.status === 'Active').length;

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-5">Dashboard overview</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total pensioners', value: pensioners.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active', value: active, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Disbursed this month', value: '—', icon: Banknote, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'FY 2025–26 total', value: '—', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className={`${bg} ${color} rounded-lg p-2`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-semibold text-slate-800">{loading ? '…' : value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Pensioner list</h2>
          <span className="text-xs text-slate-400">{pensioners.length} records</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase border-b border-slate-100">
                {['Pensioner ID', 'Name', 'PPO No.', 'Base Pension', 'Status', 'Pension Start'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pensioners.map((p) => (
                <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-blue-600 font-medium">{p.pensionerId}</td>
                  <td className="px-5 py-3 text-slate-700">{p.name}</td>
                  <td className="px-5 py-3 text-slate-500">{p.ppoNo}</td>
                  <td className="px-5 py-3 text-slate-700">₹{p.basePensionAmount?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {p.pensionStartDate ? new Date(p.pensionStartDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}