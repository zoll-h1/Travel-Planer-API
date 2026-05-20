import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tripAPI } from '../api/apiService';
import { ArrowLeft, Save, MapPin, CalendarDays, Wallet, FileText, Tag, AlertCircle } from 'lucide-react';

const STATUSES = [
  { value: 'PLANNED', label: 'Planned' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const inputCls = "w-full px-3 py-2.5 bg-[#0a1020] border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all";

const Field = ({ label, icon: Icon, required, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-1.5">
      {Icon && <Icon size={12} className="text-blue-400" />}
      {label}{required && <span className="text-blue-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const TripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '', destination: '', description: '',
    startDate: '', endDate: '', budget: '', status: 'PLANNED',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      tripAPI.getTripById(id)
        .then(res => {
          const t = res.data;
          setFormData({
            title: t.title, destination: t.destination, description: t.description || '',
            startDate: t.startDate, endDate: t.endDate, budget: t.budget || '', status: t.status,
          });
        })
        .catch(() => setError('Failed to load trip'))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      return setError('Start date must be before end date');
    }
    setLoading(true);
    try {
      const payload = { ...formData, budget: formData.budget ? parseFloat(formData.budget) : 0 };
      if (isEdit) await tripAPI.updateTrip(id, payload);
      else await tripAPI.createTrip(payload);
      navigate('/trips');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 text-blue-400">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060c1a] px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/trips')}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{isEdit ? 'Edit Trip' : 'New Trip'}</h1>
            <p className="text-gray-500 text-xs mt-0.5">{isEdit ? 'Update trip details' : 'Plan your next adventure'}</p>
          </div>
        </div>

        <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 px-3 py-2.5 rounded-xl mb-5 text-sm">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Trip Title" icon={Tag} required>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                required maxLength={100} placeholder="e.g., Summer Vacation 2026" className={inputCls} />
            </Field>

            <Field label="Destination" icon={MapPin} required>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange}
                required maxLength={100} placeholder="e.g., Paris, France" className={inputCls} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date" icon={CalendarDays} required>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={inputCls} />
              </Field>
              <Field label="End Date" icon={CalendarDays} required>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Budget ($)" icon={Wallet}>
                <input type="number" name="budget" value={formData.budget} onChange={handleChange}
                  min="0" step="0.01" placeholder="0.00" className={inputCls} />
              </Field>
              <Field label="Status" icon={Tag} required>
                <select name="status" value={formData.status} onChange={handleChange} required className={inputCls}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Description" icon={FileText}>
              <textarea name="description" value={formData.description} onChange={handleChange}
                maxLength={5000} rows={3} placeholder="Describe your trip..." className={inputCls} />
            </Field>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                <Save size={15} />
                {loading ? 'Saving...' : isEdit ? 'Update Trip' : 'Create Trip'}
              </button>
              <button type="button" onClick={() => navigate('/trips')}
                className="px-5 py-2.5 bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 font-medium text-sm rounded-xl transition-all border border-gray-700/50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripForm;
