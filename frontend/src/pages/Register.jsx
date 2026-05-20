import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Plane, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const Field = ({ label, name, type = 'text', icon: Icon, placeholder, value, onChange, showToggle, showPassword, onToggle }) => (
  <div>
    <label className="block text-gray-400 text-xs font-medium mb-1.5">{label}</label>
    <div className="relative">
      <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type={showToggle ? (showPassword ? 'text' : 'password') : type}
        name={name} value={value}
        onChange={onChange} required placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 bg-[#0a1020] border border-gray-700/50 rounded-lg text-white text-sm placeholder-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ username: formData.username, email: formData.email, password: formData.password });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060c1a] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-500/30">
            <Plane size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Start planning your travels</p>
        </div>

        <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-6 shadow-2xl shadow-blue-500/5">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2.5 rounded-lg mb-4 text-sm">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-2.5 rounded-lg mb-4 text-sm">
              <CheckCircle size={15} className="shrink-0" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Username" name="username" icon={User} placeholder="johndoe" value={formData.username} onChange={handleChange} />
            <Field label="Email" name="email" type="email" icon={Mail} placeholder="your@email.com" value={formData.email} onChange={handleChange} />
            <Field label="Password" name="password" type="password" icon={Lock} placeholder="Min 6 characters" value={formData.password} onChange={handleChange} showToggle showPassword={showPassword} onToggle={() => setShowPassword(p => !p)} />
            <Field label="Confirm Password" name="confirmPassword" type="password" icon={Lock} placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} showToggle showPassword={showConfirmPassword} onToggle={() => setShowConfirmPassword(p => !p)} />

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
