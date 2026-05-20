import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AlertCircle, Camera, CheckCircle2, FileText, Mail, Save, User, Heart, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const inputCls = 'w-full px-3 py-2.5 bg-[#0a1020] border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all';

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-1.5">
      {Icon && <Icon size={12} className="text-blue-400" />}
      {label}
    </label>
    {children}
  </div>
);

const getInitial = (value) => (value?.trim()?.charAt(0) || 'U').toUpperCase();
const getAvatarLabel = (user, username) => username || user?.email || 'User';

const AvatarPreview = ({ user, username, avatarUrl }) => {
  if (avatarUrl?.trim()) {
    return (
      <img
        src={avatarUrl.trim()}
        alt={getAvatarLabel(user, username)}
        className="w-24 h-24 rounded-full object-cover border border-blue-500/20 shadow-lg shadow-blue-500/10"
      />
    );
  }

  return (
    <div className="w-24 h-24 rounded-full bg-blue-600 text-white text-3xl font-semibold flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10">
      {getInitial(getAvatarLabel(user, username))}
    </div>
  );
};

const Profile = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatarUrl: '',
    travelPreferences: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const currentUser = await refreshUser();
        setFormData({
          username: currentUser?.username || '',
          bio: currentUser?.bio || '',
          avatarUrl: currentUser?.avatarUrl || '',
          travelPreferences: currentUser?.travelPreferences || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [refreshUser]);

  let memberSince = '—';

  if (user?.createdAt) {
    try {
      memberSince = format(new Date(user.createdAt), 'MMMM d, yyyy');
    } catch {
      memberSince = '—';
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateProfile({
        username: formData.username.trim(),
        bio: formData.bio.trim(),
        avatarUrl: formData.avatarUrl.trim(),
        travelPreferences: formData.travelPreferences.trim(),
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060c1a] px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">View and update your travel profile</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <AvatarPreview
                user={user}
                username={formData.username}
                avatarUrl={formData.avatarUrl}
              />
              <h2 className="text-white text-lg font-semibold mt-4">{formData.username || user?.email || 'Traveler'}</h2>
              <p className="text-gray-500 text-sm mt-1 break-all">{user?.email}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-[#0a1020] border border-gray-800/60 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-1.5">
                  <CalendarDays size={12} className="text-blue-400" />
                  Member Since
                </div>
                <p className="text-white text-sm">{memberSince}</p>
              </div>

              <div className="bg-[#0a1020] border border-gray-800/60 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-1.5">
                  <Heart size={12} className="text-blue-400" />
                  Travel Preferences
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {formData.travelPreferences || 'No travel preferences added yet.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1528] border border-blue-500/15 rounded-2xl p-6">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 px-3 py-2.5 rounded-xl mb-5 text-sm">
                <AlertCircle size={15} className="shrink-0" /> {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-3 py-2.5 rounded-xl mb-5 text-sm">
                <CheckCircle2 size={15} className="shrink-0" /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Username" icon={User}>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={50}
                    className={inputCls}
                    placeholder="Your username"
                  />
                </Field>

                <Field label="Email" icon={Mail}>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className={`${inputCls} cursor-not-allowed opacity-75`}
                    placeholder="Email"
                  />
                </Field>
              </div>

              <Field label="Avatar URL" icon={Camera}>
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  maxLength={500}
                  className={inputCls}
                  placeholder="https://example.com/avatar.jpg"
                />
              </Field>

              <Field label="Bio" icon={FileText}>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={4}
                  className={inputCls}
                  placeholder="Tell other travelers a bit about yourself"
                />
              </Field>

              <Field label="Travel Preferences" icon={Heart}>
                <textarea
                  name="travelPreferences"
                  value={formData.travelPreferences}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={4}
                  className={inputCls}
                  placeholder="Cities, hiking, beaches, museums, local food..."
                />
              </Field>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  <Save size={15} />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
