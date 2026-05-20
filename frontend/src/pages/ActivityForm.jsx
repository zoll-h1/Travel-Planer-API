import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { activityAPI } from '../api/apiService';
import { ArrowLeft, Save, Plane, Hotel, Utensils, Car, Landmark, MoreHorizontal, CalendarDays, Wallet, FileText, AlertCircle } from 'lucide-react';

const ACTIVITY_TYPES = [
  { value: 'FLIGHT',      label: 'Flight',      icon: Plane,          color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  { value: 'HOTEL',       label: 'Hotel',       icon: Hotel,          color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { value: 'RESTAURANT',  label: 'Restaurant',  icon: Utensils,       color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  { value: 'SIGHTSEEING', label: 'Sightseeing', icon: Landmark,       color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { value: 'TRANSPORT',   label: 'Transport',   icon: Car,            color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  { value: 'OTHER',       label: 'Other',       icon: MoreHorizontal, color: 'bg-gray-500/15 text-gray-400 border-gray-500/30' },
];

const inputCls = "w-full px-3 py-2.5 bg-[#0a1020] border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all";

const ActivityForm = () => {
  const { tripId, activityId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!activityId;

  const [formData, setFormData] = useState({
    name: '', type: 'SIGHTSEEING', activityDate: '', cost: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      activityAPI.getActivityById(tripId, activityId)
        .then(res => {
          const a = res.data;
          setFormData({ name: a.name, type: a.type, activityDate: a.activityDate, cost: a.cost || '', notes: a.notes || '' });
        })
        .catch(() => setError('Failed to load activity'))
        .finally(() => setFetching(false));
    }
  }, [activityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...formData, cost: formData.cost ? parseFloat(formData.cost) : 0 };
      if (isEdit) await activityAPI.updateActivity(tripId, activityId, payload);
      else await activityAPI.createActivity(tripId, payload);
      navigate(`/trips/${tripId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save activity');
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
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/trips/${tripId}`)}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{isEdit ? 'Edit Activity' : 'Add Activity'}</h1>
            <p className="text-gray-500 text-xs mt-0.5">{isEdit ? 'Update activity details' : 'Add a new activity to your trip'}</p>
          </div>
        </div>

        <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 px-3 py-2.5 rounded-xl mb-5 text-sm">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5">
                Activity Name <span className="text-blue-400">*</span>
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                required maxLength={100} placeholder="e.g., Visit Eiffel Tower" className={inputCls} />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-2">
                Type <span className="text-blue-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ACTIVITY_TYPES.map(({ value, label, icon: Icon, color }) => (
                  <button key={value} type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: value }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      formData.type === value ? color : 'bg-[#0a1020] border-gray-700/50 text-gray-500 hover:border-gray-600/70'
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-1.5">
                  <CalendarDays size={12} className="text-blue-400" /> Date <span className="text-blue-400">*</span>
                </label>
                <input type="date" name="activityDate" value={formData.activityDate} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-1.5">
                  <Wallet size={12} className="text-blue-400" /> Cost ($) <span className="text-blue-400">*</span>
                </label>
                <input type="number" name="cost" value={formData.cost} onChange={handleChange}
                  required min="0" step="0.01" placeholder="0.00" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-1.5">
                <FileText size={12} className="text-blue-400" /> Notes
              </label>
              <textarea name="notes" value={formData.notes} onChange={handleChange}
                maxLength={5000} rows={3} placeholder="Additional details..." className={inputCls} />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                <Save size={15} />
                {loading ? 'Saving...' : isEdit ? 'Update Activity' : 'Add Activity'}
              </button>
              <button type="button" onClick={() => navigate(`/trips/${tripId}`)}
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

export default ActivityForm;
