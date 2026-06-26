import { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
  { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
  { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

const currentDate = new Date();

export default function BulkCreditEntry() {
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const fetchPensioners = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.get(`/credits/active-pensioners?month=${month}&year=${year}`);
      setEntries(
        res.data.data.map((p) => ({
          ...p,
          amountCredited: p.amountCredited,
          remarks: p.remarks || '',
          modified: p.amountCredited !== p.basePensionAmount,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = (id, field, value) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e._id !== id) return e;
        const updated = { ...e, [field]: value };
        updated.modified =
          parseFloat(updated.amountCredited) !== parseFloat(updated.basePensionAmount);
        return updated;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        month,
        year,
        enteredBy: 'admin',
        entries: entries.map((e) => ({
          pensionerId: e._id,
          amountCredited: parseFloat(e.amountCredited),
          remarks: e.remarks,
        })),
      };
      const res = await api.post('/credits/bulk', payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const batchTotal = entries.reduce((s, e) => s + (parseFloat(e.amountCredited) || 0), 0);

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-5">Bulk monthly credit entry</h1>

      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-500 font-medium">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none bg-white"
          >
            {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-500 font-medium">Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none w-24"
          />
        </div>
        <button
          onClick={fetchPensioners}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw size={14} /> Load pensioners
        </button>
        <div className="flex-1" />
        {entries.length > 0 && (
          <div className="text-sm text-slate-500">
            Batch total: <span className="font-semibold text-blue-600">₹{batchTotal.toLocaleString('en-IN')}</span>
          </div>
        )}
        {entries.length > 0 && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            <Save size={15} /> {saving ? 'Saving…' : 'Save all entries'}
          </button>
        )}
      </div>

      {/* Result banner */}
      {result && (
        <div className={`mb-4 p-4 rounded-xl border flex items-start gap-3 ${result.failed > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
          <AlertCircle size={16} className={result.failed > 0 ? 'text-amber-600 mt-0.5' : 'text-green-600 mt-0.5'} />
          <div className="text-sm">
            <p className={`font-medium ${result.failed > 0 ? 'text-amber-800' : 'text-green-800'}`}>
              {result.saved} entries saved successfully{result.failed > 0 ? `, ${result.failed} failed` : ''}.
            </p>
            {result.errors?.map((e, i) => (
              <p key={i} className="text-amber-600 text-xs mt-1">{e.pensionerId}: {e.reason}</p>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {loading && <div className="text-center text-slate-400 text-sm py-12">Loading pensioners…</div>}

      {!loading && entries.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[28px_1fr_100px_110px_72px_120px_1fr] gap-2 px-4 py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase">
            <span>#</span><span>Pensioner</span><span>PPO no.</span>
            <span>Base pension</span><span>Flag</span><span>Amount (₹)</span><span>Remarks</span>
          </div>
          {entries.map((e, idx) => (
            <div
              key={e._id}
              className={`grid grid-cols-[28px_1fr_100px_110px_72px_120px_1fr] gap-2 items-center px-4 py-3 border-b border-slate-50 text-sm ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}
            >
              <span className="text-slate-300 text-xs">{idx + 1}</span>
              <div>
                <p className="font-medium text-slate-700">{e.name}</p>
                <p className="text-xs text-slate-400">{e.pensionerId}</p>
              </div>
              <span className="text-slate-500 text-xs">{e.ppoNo}</span>
              <span className="text-slate-600">₹{e.basePensionAmount?.toLocaleString('en-IN')}</span>
              <span>
                {e.alreadySaved ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Saved</span>
                ) : e.modified ? (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Modified</span>
                ) : (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Base</span>
                )}
              </span>
              <input
                type="number"
                value={e.amountCredited}
                onChange={(ev) => updateEntry(e._id, 'amountCredited', ev.target.value)}
                className={`border rounded-lg px-2 py-1.5 text-right text-sm outline-none w-full ${
                  e.modified ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200'
                }`}
              />
              <input
                type="text"
                value={e.remarks}
                onChange={(ev) => updateEntry(e._id, 'remarks', ev.target.value)}
                placeholder="Optional remarks"
                className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none w-full text-slate-600"
              />
            </div>
          ))}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between text-sm">
            <span className="text-slate-400">{entries.length} active pensioners</span>
            <span className="font-semibold text-slate-700">
              Total: <span className="text-blue-600">₹{batchTotal.toLocaleString('en-IN')}</span>
            </span>
          </div>
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center text-slate-400 text-sm py-16 bg-white border border-slate-200 rounded-xl">
          Select a month and year, then click "Load pensioners" to begin.
        </div>
      )}
    </div>
  );
}