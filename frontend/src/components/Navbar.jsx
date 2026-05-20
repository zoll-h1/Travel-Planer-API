import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, LayoutDashboard, Map, LogOut, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive(to)
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-[#080e1f]/95 backdrop-blur border-b border-blue-500/10 shadow-lg shadow-blue-500/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
              <Plane size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-wide">TravelPlanner</span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavLink to="/trips" icon={Map} label="My Trips" />
            </div>
          )}

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <User size={14} className="text-blue-400" />
                  <span className="text-gray-300 text-xs font-medium">
                    {user?.username || user?.email || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-blue-500/10 bg-[#080e1f] px-4 py-3 space-y-1">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavLink to="/trips" icon={Map} label="My Trips" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-gray-400 hover:text-white">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-white bg-blue-600 rounded-lg text-center">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
