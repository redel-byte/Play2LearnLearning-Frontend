import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faDownload,
  faKey,
  faLock,
  faShieldAlt,
  faSignOutAlt,
  faSyncAlt,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { deleteMyAccount, Logout, refreshSession, updateMyPassword } from '../../api/auth';
import { getErrorMessage } from '../../api/api';
import { getStoredUser } from '../../api/userManagment';
import { getMyAttemptHistory } from '../../api/attempts';

const emptyPasswordForm = {
  current_password: '',
  password: '',
  password_confirmation: '',
};

const getRoleLabel = (user) => {
  if (user?.is_admin) return 'Admin';
  if (user?.is_teacher) return 'Teacher';
  return 'Learner';
};

const Settings = () => {
  const navigate = useNavigate();
  const userData = getStoredUser();
  const user = userData?.user || {};

  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [changingPassword, setChangingPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const updatePasswordField = (field, value) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('New password and confirmation must match');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await updateMyPassword(passwordForm);
      setPasswordForm(emptyPasswordForm);
      toast.success(response?.message || 'Password updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update password'));
    } finally {
      setChangingPassword(false);
    }
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
        attempts: attemptsResponse.data ?? [],
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'play2learn-account-export.json';
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
            Manage your account security, session, and data.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faShieldAlt} className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold mb-3">Account</h2>
            <p className="text-gray-500 mb-4">Your current signed-in account.</p>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span>Role</span>
                <span className="font-medium">{getRoleLabel(user)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span>Email</span>
                <span className="font-medium text-right">{user?.email || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Name</span>
                <span className="font-medium text-right">
                  {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Unknown'}
                </span>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
              <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
              <p className="text-indigo-100">Update your password using your current password.</p>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="current_password">
                  Current password
                </label>
                <input
                  id="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(event) => updatePasswordField('current_password', event.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                    New password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={passwordForm.password}
                    onChange={(event) => updatePasswordField('password', event.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password_confirmation">
                    Confirm new password
                  </label>
                  <input
                    id="password_confirmation"
                    type="password"
                    value={passwordForm.password_confirmation}
                    onChange={(event) => updatePasswordField('password_confirmation', event.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  textContent={<><FontAwesomeIcon icon={faLock} /> Update Password</>}
                  loading={changingPassword}
                  disabled={changingPassword}
                />
              </div>
            </form>
          </section>
        </div>

        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faUserCog} className="text-indigo-600" />
              Account Management
            </h2>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">Refresh Session</h3>
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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">Export Your Data</h3>
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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">Logout</h3>
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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-red-50 rounded-xl">
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
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
        </section>
      </div>
    </main>
  );
};

export default Settings;
