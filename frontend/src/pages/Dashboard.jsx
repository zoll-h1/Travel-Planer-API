import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripAPI } from '../api/apiService';
import { format } from 'date-fns';
import { 
  Globe, TrendingUp, MapPin, CheckCircle, Clock, PlusCircle, 
  ArrowRight, Wallet, AlertCircle, BarChart3, CalendarDays
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, upcomingRes] = await Promise.all([
        tripAPI.getTripStats(),
        tripAPI.getUpcomingTrips(),
      ]);
      setStats(statsRes.data);
      setUpcomingTrips(upcomingRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 text-blue-400">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading dashboard...</span>
      </div>
    </div>
  );

  const budgetUsedPct = stats?.totalBudget > 0 ? Math.min((stats.totalCost / stats.totalBudget) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[#060c1a] px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Your travel overview</p>
          </div>
          <Link
            to="/trips/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <PlusCircle size={16} />
            New Trip
          </Link>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Globe} label="Total Trips" value={stats?.totalTrips ?? 0} color="blue" />
          <StatCard icon={Clock} label="Planned" value={stats?.plannedCount ?? 0} color="indigo" />
          <StatCard icon={TrendingUp} label="Ongoing" value={stats?.ongoingCount ?? 0} color="cyan" />
          <StatCard icon={CheckCircle} label="Completed" value={stats?.completedCount ?? 0} color="emerald" />
        </div>

        {/* Budget Overview */}
        {stats?.totalBudget > 0 && (
          <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wallet size={18} className="text-blue-400" />
              <h2 className="text-white font-semibold">Budget Overview</h2>
              <span className="ml-auto text-xs text-gray-500">All trips combined</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Total Budget</p>
                <p className="text-xl font-bold text-white">${stats.totalBudget.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Total Spent</p>
                <p className="text-xl font-bold text-blue-400">${(stats.totalCost || 0).toFixed(0)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Remaining</p>
                <p className={`text-xl font-bold ${(stats.totalBudget - stats.totalCost) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${Math.abs(stats.totalBudget - (stats.totalCost || 0)).toFixed(0)}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${budgetUsedPct > 90 ? 'bg-red-500' : budgetUsedPct > 70 ? 'bg-amber-500' : 'bg-blue-500'}`}
                style={{ width: `${budgetUsedPct}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-600 mt-1">{budgetUsedPct.toFixed(1)}% used</p>
          </div>
        )}

        {/* Upcoming Trips */}
        <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={18} className="text-blue-400" />
            <h2 className="text-white font-semibold">Upcoming Trips</h2>
            <Link to="/trips" className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {upcomingTrips.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 size={32} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No upcoming trips</p>
              <Link to="/trips/new" className="text-blue-400 text-xs hover:text-blue-300 mt-1 inline-block">
                Plan one now →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTrips.slice(0, 5).map(trip => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="flex items-center gap-3 p-3 bg-[#0a1020] hover:bg-[#101828] border border-gray-800/50 hover:border-blue-500/25 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{trip.title}</p>
                    <p className="text-gray-500 text-xs truncate">{trip.destination}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-400 text-xs">{format(new Date(trip.startDate), 'MMM dd')}</p>
                    <StatusBadge status={trip.status} />
                  </div>
                  <ArrowRight size={14} className="text-gray-700 group-hover:text-blue-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };
  return (
    <div className={`bg-[#0d1528] border rounded-2xl p-4 ${colors[color]}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={16} />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = {
    PLANNED: 'bg-blue-500/15 text-blue-400',
    ONGOING: 'bg-emerald-500/15 text-emerald-400',
    COMPLETED: 'bg-gray-500/15 text-gray-400',
    CANCELLED: 'bg-red-500/15 text-red-400',
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5 ${cfg[status] || cfg.PLANNED}`}>
      {status}
    </span>
  );
};

export default Dashboard;
