import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripAPI, activityAPI } from '../api/apiService';
import { format } from 'date-fns';
import {
  MapPin, CalendarDays, Wallet, PlusCircle, Pencil, Trash2, ArrowLeft,
  Plane, Hotel, Utensils, Car, Landmark, MoreHorizontal,
  TrendingUp, Clock
} from 'lucide-react';

const ACTIVITY_ICONS = {
  SIGHTSEEING: Landmark,
  HOTEL: Hotel,
  FLIGHT: Plane,
  RESTAURANT: Utensils,
  TRANSPORT: Car,
  OTHER: MoreHorizontal,
};

const STATUS_CFG = {
  PLANNED:   { cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25', dot: 'bg-blue-400' },
  ONGOING:   { cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
  COMPLETED: { cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25', dot: 'bg-gray-400' },
  CANCELLED: { cls: 'bg-red-500/15 text-red-400 border-red-500/25', dot: 'bg-red-400' },
};

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTripDetails(); }, [id]);

  const fetchTripDetails = async () => {
    try {
      const [tripRes, activitiesRes] = await Promise.all([
        tripAPI.getTripById(id),
        activityAPI.getAllActivitiesByTrip(id),
      ]);
      setTrip(tripRes.data);
      setActivities(activitiesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await activityAPI.deleteActivity(id, activityId);
      setActivities(activities.filter(a => a.id !== activityId));
    } catch { alert('Error deleting activity'); }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm('Delete entire trip? This cannot be undone!')) return;
    try {
      await tripAPI.deleteTrip(id);
      navigate('/trips');
    } catch { alert('Error deleting trip'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 text-blue-400">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );

  if (!trip) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-gray-500">Trip not found</p>
    </div>
  );

  const cfg = STATUS_CFG[trip.status] || STATUS_CFG.PLANNED;
  const totalSpent = activities.reduce((s, a) => s + (parseFloat(a.cost) || 0), 0);
  const budget = parseFloat(trip.budget) || 0;
  const remaining = budget - totalSpent;
  const pct = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const days = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-[#060c1a] px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-5">

        <div className="flex items-center justify-between">
          <Link to="/trips" className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> My Trips
          </Link>
          <div className="flex gap-2">
            <Link
              to={`/trips/${id}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1528] hover:bg-[#162035] border border-gray-700/50 text-gray-300 text-xs font-medium rounded-lg transition-all"
            >
              <Pencil size={13} /> Edit
            </Link>
            <button
              onClick={handleDeleteTrip}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-all"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-bold text-white">{trip.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                <MapPin size={14} className="text-blue-400" />
                {trip.destination}
              </div>
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border shrink-0 ${cfg.cls}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {trip.status === 'CANCELLED' ? 'Cancelled' : trip.status.charAt(0) + trip.status.slice(1).toLowerCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { icon: CalendarDays, label: 'Start', val: trip.startDate ? format(new Date(trip.startDate), 'MMM dd, yyyy') : '—' },
              { icon: CalendarDays, label: 'End',   val: trip.endDate   ? format(new Date(trip.endDate),   'MMM dd, yyyy') : '—' },
              { icon: Clock,        label: 'Duration', val: days > 0 ? `${days} days` : '—' },
              { icon: Wallet,       label: 'Budget', val: `$${budget.toLocaleString()}` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-[#0a1020] rounded-xl p-3 border border-gray-800/50">
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                  <Icon size={12} className="text-blue-400" /> {label}
                </div>
                <p className="text-white text-sm font-semibold">{val}</p>
              </div>
            ))}
          </div>

          {trip.description && (
            <p className="text-gray-400 text-sm mb-5 leading-relaxed border-t border-gray-800/50 pt-4">{trip.description}</p>
          )}

          <div className="bg-[#0a1020] rounded-xl p-4 border border-gray-800/50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-blue-400" />
              <span className="text-white text-sm font-medium">Budget Tracker</span>
              <span className="ml-auto text-xs text-gray-500">{pct.toFixed(1)}% used</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-gray-500 text-xs">Budget</p>
                <p className="text-white font-bold text-base">${budget.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Spent</p>
                <p className="text-blue-400 font-bold text-base">${totalSpent.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Remaining</p>
                <p className={`font-bold text-base ${remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${Math.abs(remaining).toFixed(0)}{remaining < 0 ? ' over' : ''}
                </p>
              </div>
            </div>
            {budget > 0 && (
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">
              Activities
              <span className="ml-2 text-xs text-gray-500 font-normal">{activities.length} total</span>
            </h2>
            <Link
              to={`/trips/${id}/activities/new`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <PlusCircle size={13} /> Add Activity
            </Link>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-10">
              <Plane size={32} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No activities yet</p>
              <Link to={`/trips/${id}/activities/new`} className="text-blue-400 text-xs hover:text-blue-300 mt-1 inline-block">
                Add your first activity →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} tripId={id} onDelete={handleDeleteActivity} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const ActivityCard = ({ activity, tripId, onDelete }) => {
  const Icon = ACTIVITY_ICONS[activity.type] || MoreHorizontal;
  const TYPE_COLORS = {
    SIGHTSEEING: 'bg-purple-500/10 text-purple-400',
    HOTEL:       'bg-blue-500/10 text-blue-400',
    FLIGHT:      'bg-cyan-500/10 text-cyan-400',
    RESTAURANT:  'bg-orange-500/10 text-orange-400',
    TRANSPORT:   'bg-yellow-500/10 text-yellow-400',
    OTHER:       'bg-gray-500/10 text-gray-400',
  };
  const colorCls = TYPE_COLORS[activity.type] || TYPE_COLORS.OTHER;

  return (
    <div className="flex items-center gap-3 p-3 bg-[#0a1020] border border-gray-800/50 hover:border-blue-500/20 rounded-xl transition-all group">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{activity.name}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
          <span className="flex items-center gap-1">
            <CalendarDays size={10} />
            {activity.activityDate ? format(new Date(activity.activityDate), 'MMM dd, yyyy') : '—'}
          </span>
          {activity.notes && <span className="truncate max-w-[120px]">{activity.notes}</span>}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-white text-sm font-semibold">${parseFloat(activity.cost || 0).toFixed(0)}</p>
        <span className={`text-[10px] ${colorCls.split(' ')[1]}`}>{activity.type}</span>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/trips/${tripId}/activities/${activity.id}/edit`}
          className="p-1.5 bg-gray-700/30 hover:bg-gray-700/60 text-gray-400 hover:text-white rounded-lg transition-all"
        >
          <Pencil size={12} />
        </Link>
        <button
          onClick={() => onDelete(activity.id)}
          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default TripDetail;
