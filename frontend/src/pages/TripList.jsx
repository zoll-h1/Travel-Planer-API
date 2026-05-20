import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripAPI } from '../api/apiService';
import { format } from 'date-fns';
import { 
  MapPin, CalendarDays, Wallet, PlusCircle, Eye, Pencil, Trash2, 
  Plane, Globe, Search
} from 'lucide-react';

const STATUS_FILTERS = ['ALL', 'PLANNED', 'ONGOING', 'COMPLETED'];

const STATUS_CFG = {
  PLANNED:   { cls: 'bg-blue-500/15 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
  ONGOING:   { cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  COMPLETED: { cls: 'bg-gray-500/15 text-gray-400 border-gray-500/20', dot: 'bg-gray-400' },
  CANCELLED: { cls: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-400' },
};

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const res = await tripAPI.getAllTrips();
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await tripAPI.deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
    } catch { alert('Error deleting trip'); }
  };

  const filtered = trips.filter(t => {
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase()) ||
                        t.destination?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 text-blue-400">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading trips...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060c1a] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">My Trips</h1>
            <p className="text-gray-500 text-sm mt-0.5">{trips.length} trip{trips.length !== 1 ? 's' : ''} total</p>
          </div>
          <Link
            to="/trips/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <PlusCircle size={16} />
            New Trip
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search trips..."
              className="w-full pl-8 pr-3 py-2 bg-[#0d1528] border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="flex gap-1.5">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#0d1528] text-gray-400 border-gray-700/50 hover:border-blue-500/30 hover:text-gray-200'
                }`}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Globe size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No trips found</p>
            <Link to="/trips/new" className="text-blue-400 text-sm hover:text-blue-300 mt-2 inline-block">
              Create your first trip →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TripCard = ({ trip, onDelete }) => {
  const cfg = STATUS_CFG[trip.status] || STATUS_CFG.PLANNED;
  const days = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-[#0d1528] border border-blue-500/10 hover:border-blue-500/25 rounded-2xl p-5 transition-all group flex flex-col gap-4">
      {/* Title + Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
            <Plane size={14} className="text-blue-400" />
          </div>
          <h3 className="text-white font-semibold text-sm truncate">{trip.title}</h3>
        </div>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${cfg.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {trip.status === 'CANCELLED' ? 'Cancelled' : trip.status.charAt(0) + trip.status.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <MapPin size={12} className="text-blue-400 shrink-0" />
          <span className="truncate">{trip.destination}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <CalendarDays size={12} className="text-blue-400 shrink-0" />
          <span>
            {trip.startDate ? format(new Date(trip.startDate), 'MMM dd') : '—'} →{' '}
            {trip.endDate ? format(new Date(trip.endDate), 'MMM dd, yyyy') : '—'}
            {days > 0 && <span className="text-gray-600 ml-1">({days}d)</span>}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Wallet size={12} className="text-blue-400 shrink-0" />
          <span className="text-white font-medium">${(trip.budget || 0).toLocaleString()}</span>
          {trip.totalCost > 0 && (
            <span className="text-gray-600">· ${trip.totalCost.toLocaleString()} spent</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1 border-t border-gray-800/60">
        <Link
          to={`/trips/${trip.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 text-xs font-medium rounded-lg transition-all border border-blue-500/20"
        >
          <Eye size={12} /> View
        </Link>
        <Link
          to={`/trips/${trip.id}/edit`}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-700/20 hover:bg-gray-700/40 text-gray-300 text-xs font-medium rounded-lg transition-all border border-gray-700/30"
        >
          <Pencil size={12} /> Edit
        </Link>
        <button
          onClick={() => onDelete(trip.id)}
          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default TripList;
