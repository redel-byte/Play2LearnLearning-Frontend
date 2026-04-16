import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCheckCircle,
  faCog,
  faDownload,
  faEnvelope,
  faEye,
  faGraduationCap,
  faKey,
  faShieldAlt,
  faSignOutAlt,
  faSyncAlt,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { deleteMyAccount, Logout, refreshSession } from '../../api/auth';
import { getStoredUser } from '../../api/userManagment';
import { getMyAttemptHistory } from '../../api/attempts';

const SETTINGS_STORAGE_KEY = 'play2learn_settings';

const defaultSettings = {
  profileVisibility: 'private',
  showEmail: false,
  quizReminders: true,
  emailUpdates: true,
  difficultyLevel: 'Medium',
  studyReminders: 'Daily',
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    aria-label={checked ? 'Toggle off' : 'Toggle on'}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
      checked ? 'bg-indigo-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const Settings = () => {
  const navigate = useNavigate();
  const userData = getStoredUser();
  const user = userData?.user || {};

  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!storedSettings) {
      return;
    }

    try {
      const parsed = JSON.parse(storedSettings);
      const merged = { ...defaultSettings, ...parsed };
      setSavedSettings(merged);
      setSettings(merged);
    } catch {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  }, []);

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [savedSettings, settings],
  );

  const updateSetting = (field, value) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setSavedSettings(settings);
      toast.success('Settings saved successfully');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSettings(savedSettings);
    toast('Unsaved changes were discarded');
  };

  const handleRefreshSession = async () => {
    setRefreshing(true);
    try {
      await refreshSession();
      toast.success('Session refreshed successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to refresh session');
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const attemptsResponse = await getMyAttemptHistory({ per_page: 100 });
      const exportPayload = {
        exported_at: new Date().toISOString(),
        user,
        settings,
        attempts: attemptsResponse.data ?? [],
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'play2learn-settings-export.json';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Your data export is ready');
    } catch {
      toast.error('Failed to export your data');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const email = user?.email || 'your account';
    const confirmed = window.confirm(
      `Delete ${email}? This uses soft delete, so the account record is kept in the database but your profile will no longer be available in the app.`,
    );

    if (!confirmed) {
      return;
    }

    const finalConfirmation = window.confirm(
      'This will end your session immediately. Do you want to continue?',
    );

    if (!finalConfirmation) {
      return;
    }

    setDeletingAccount(true);
    try {
      await deleteMyAccount();
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      toast.success('Your account has been deleted');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to delete your account');
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await Logout();
      navigate('/');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 99 }}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <FontAwesomeIcon icon={faCog} className="text-indigo-600 text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Settings</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Personalize your experience, manage your session, and export your learning data.
          </p>
        </div>

        <div className="space-y-8">
          <section className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Account Security</h3>
              <p className="text-gray-500 mb-4">Manage your current session and account access.</p>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between py-2">
                  <span>Current role</span>
                  <span className="font-medium capitalize">
                    {user?.is_admin ? 'Admin' : user?.is_teacher ? 'Teacher' : 'Learner'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Email status</span>
                  <span className="font-medium">{user?.email || 'Unknown'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faEye} className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy Controls</h3>
              <p className="text-gray-500 mb-4">Choose what is visible and what stays private.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Profile Visibility</span>
                  <select
                    value={settings.profileVisibility}
                    onChange={(event) => updateSetting('profileVisibility', event.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-700">Show Email</span>
                  </div>
                  <Toggle checked={settings.showEmail} onChange={(value) => updateSetting('showEmail', value)} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Notifications</h3>
              <p className="text-gray-500 mb-4">Control reminder and email preference switches.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Quiz Reminders</span>
                  <Toggle checked={settings.quizReminders} onChange={(value) => updateSetting('quizReminders', value)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email Updates</span>
                  <Toggle checked={settings.emailUpdates} onChange={(value) => updateSetting('emailUpdates', value)} />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
              <h2 className="text-2xl font-bold text-white mb-2">Advanced Settings</h2>
              <p className="text-indigo-100">Adjust learning preferences and account actions.</p>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-indigo-600" />
                  Learning Preferences
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">Difficulty Level</h4>
                    <p className="text-sm text-gray-500 mb-3">Set your preferred quiz difficulty</p>
                    <div className="flex gap-2">
                      {['Easy', 'Medium', 'Hard'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updateSetting('difficultyLevel', level)}
                          className={`px-4 py-2 text-sm rounded-lg border transition ${
                            settings.difficultyLevel === level
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">Study Reminders</h4>
                    <p className="text-sm text-gray-500 mb-3">Choose how often you want reminder prompts</p>
                    <select
                      value={settings.studyReminders}
                      onChange={(event) => updateSetting('studyReminders', event.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Never">Never</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserCog} className="text-indigo-600" />
                  Account Management
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Refresh Session</h4>
                      <p className="text-sm text-gray-500">Request a fresh auth token from the backend.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRefreshSession}
                      disabled={refreshing}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
                      {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Export Your Data</h4>
                      <p className="text-sm text-gray-500">Download your account and attempt history as JSON.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={exporting}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      {exporting ? 'Exporting...' : 'Export'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Logout</h4>
                      <p className="text-sm text-gray-500">End your current session and return to the homepage.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-red-900">Delete Account</h4>
                      <p className="text-sm text-red-600">Soft delete your account and immediately sign out from this device.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faKey} className="mr-2" />
                      {deletingAccount ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-gray-50 px-6 py-5 mt-2">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
                  textContent="Cancel Changes"
                  onClick={handleCancel}
                  disabled={!hasChanges || loading}
                  variant='secondary'
                />
                <Button
                  className="px-5 py-2 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 transition duration-300"
                  textContent={<><FontAwesomeIcon icon={faCheckCircle} /> Save Settings</>}
                  onClick={handleSave}
                  loading={loading}
                  disabled={!hasChanges || loading}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;
