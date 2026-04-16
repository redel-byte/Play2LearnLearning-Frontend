import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  fetchAdminPermissions,
  fetchAdminUser,
  fetchAdminUsers,
  updateAdminUser,
} from '../../api/userManagment';
import { getErrorMessage } from '../../api/api';
import Navbar from '../../components/layout/Navbar';

const ROLE_OPTIONS = [
  { value: 'learner', label: 'Learner' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin', label: 'Admin' },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminUsers({
          page: currentPage,
          per_page: 12,
          search: searchTerm || undefined,
          include_stats: true,
        });

        setUsers(response.data ?? []);
        setTotalPages(response.meta?.last_page ?? 1);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load users'));
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await fetchAdminPermissions();
        setAvailablePermissions(response.data ?? []);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load permissions'));
      }
    };

    loadPermissions();
  }, []);

  const stats = useMemo(() => ({
    totalUsers: users.length,
    learners: users.filter((user) => user.is_learner).length,
    teachers: users.filter((user) => user.is_teacher).length,
    admins: users.filter((user) => user.is_admin).length,
    activeUsers: users.filter((user) => user.is_active).length,
  }), [users]);

  const openUserDetails = async (userId) => {
    setDetailsLoading(true);
    setShowUserDetails(true);

    try {
      const user = await fetchAdminUser(userId);
      setSelectedUser(user);
      setEditingUser({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        is_active: Boolean(user.is_active),
        roles: user.roles?.map((role) => role.name) ?? [],
        permissions: user.direct_permissions?.map((permission) => permission.name) ?? [],
      });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load user details'));
      setShowUserDetails(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
    setEditingUser(null);
  };

  const handleQuickUpdate = async (user, field, value) => {
    try {
      const payload = {
        first_name: user.first_name,
        last_name: user.last_name,
        is_active: field === 'is_active' ? value : Boolean(user.is_active),
        roles: field === 'roles' ? [value] : (user.roles?.map((role) => role.name) ?? []),
        permissions: user.direct_permissions?.map((permission) => permission.name) ?? [],
      };

      await updateAdminUser(user.id, payload);
      toast.success('User updated successfully');

      setUsers((current) => current.map((item) => {
        if (item.id !== user.id) {
          return item;
        }

        return {
          ...item,
          is_active: payload.is_active,
          is_admin: payload.roles.includes('admin'),
          is_teacher: payload.roles.includes('teacher'),
          is_learner: payload.roles.includes('learner'),
          roles: payload.roles.map((name) => ({ name })),
          direct_permissions: payload.permissions.map((name) => ({ name })),
        };
      }));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update user'));
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedUser || !editingUser) {
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateAdminUser(selectedUser.id, editingUser);
      toast.success('User updated successfully');

      setUsers((current) => current.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setSelectedUser(updatedUser);
      setEditingUser({
        first_name: updatedUser.first_name || '',
        last_name: updatedUser.last_name || '',
        is_active: Boolean(updatedUser.is_active),
        roles: updatedUser.roles?.map((role) => role.name) ?? [],
        permissions: updatedUser.direct_permissions?.map((permission) => permission.name) ?? [],
      });
      setShowUserDetails(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update user'));
    } finally {
      setSaving(false);
    }
  };

  const getRoleName = (user) => {
    if (user.is_admin) return 'admin';
    if (user.is_teacher) return 'teacher';
    return 'learner';
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const togglePermission = (permissionName) => {
    setEditingUser((current) => {
      const permissions = current.permissions ?? [];

      return {
        ...current,
        permissions: permissions.includes(permissionName)
          ? permissions.filter((name) => name !== permissionName)
          : [...permissions, permissionName],
      };
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 z-90 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Manage users, roles, and platform activity.</p>
              </div>
              <div className="text-sm text-gray-600">Visible users: {users.length}</div>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    setCurrentPage(1);
                    setSearchTerm(searchInput.trim());
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setSearchTerm(searchInput.trim());
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-2">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
                <div className="text-slate-700">Users</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{stats.learners}</div>
                <div className="text-green-700">Learners</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{stats.teachers}</div>
                <div className="text-blue-700">Teachers</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-900">{stats.admins}</div>
                <div className="text-red-700">Admins</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">{stats.activeUsers}</div>
                <div className="text-amber-700">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto" />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const roleName = getRoleName(user);

                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {(user.full_name || user.first_name || 'U').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.full_name || 'Unknown user'}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={roleName}
                              onChange={(event) => handleQuickUpdate(user, 'roles', event.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(roleName)} border-0 cursor-pointer`}
                            >
                              {ROLE_OPTIONS.map((role) => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={Boolean(user.is_active)}
                                onChange={(event) => handleQuickUpdate(user, 'is_active', event.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              {user.is_active ? 'Active' : 'Inactive'}
                            </label>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div>{user.completed_quizzes_count ?? 0} completed</div>
                            <div>{user.average_score ?? 0}% avg</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openUserDetails(user.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </p>
                <button
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {showUserDetails && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                {detailsLoading || !selectedUser || !editingUser ? (
                  <div className="py-10 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  </div>
                ) : (
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="text-xs text-slate-500">Points</div>
                        <div className="text-lg font-semibold text-slate-900">{selectedUser.total_points ?? 0}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="text-xs text-slate-500">Completed quizzes</div>
                        <div className="text-lg font-semibold text-slate-900">{selectedUser.completed_quizzes_count ?? 0}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          value={editingUser.first_name}
                          onChange={(event) => setEditingUser({ ...editingUser, first_name: event.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          value={editingUser.last_name}
                          onChange={(event) => setEditingUser({ ...editingUser, last_name: event.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                          value={editingUser.roles?.[0] || 'learner'}
                          onChange={(event) => setEditingUser({ ...editingUser, roles: [event.target.value] })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </div>

                      <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={editingUser.is_active}
                          onChange={(event) => setEditingUser({ ...editingUser, is_active: event.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        User is active
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Direct Permissions</label>
                        <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-md p-3 space-y-2">
                          {availablePermissions.map((permission) => (
                            <label key={permission.id} className="flex items-start gap-3 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={(editingUser.permissions ?? []).includes(permission.name)}
                                onChange={() => togglePermission(permission.name)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>
                                <span className="block font-medium">{permission.name}</span>
                                <span className="block text-xs text-gray-500">{permission.description || 'No description'}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-sm text-gray-500">
                      <div>Email: {selectedUser.email}</div>
                      <div>Last login: {selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleString() : 'Never'}</div>
                      <div>Effective permissions: {(selectedUser.permission_names ?? []).join(', ') || 'None'}</div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={closeUserDetails}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
