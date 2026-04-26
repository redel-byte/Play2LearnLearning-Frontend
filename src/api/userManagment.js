import { apiClient, unwrapCollection, unwrapItem } from './api';

const AUTH_STORAGE_EVENT = 'play2learn-auth-updated';

export const fetchAdminUsers = async (params = {}) => {
    try {
        const response = await apiClient.get('/admin/users', { params });
        return unwrapCollection(response);
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchAdminUser = async (userId) => {
    try {
        const response = await apiClient.get(`/admin/users/${userId}`);
        return unwrapItem(response);
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateAdminUser = async (userId, userData) => {
    try {
        const response = await apiClient.patch(`/admin/users/${userId}`, userData);
        return unwrapItem(response);
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAllUsers = fetchAdminUsers;
export const getUserById = fetchAdminUser;
export const updateUserRoles = updateAdminUser;

export const getAuthToken = () => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!storedUser) {
        return null;
    }

    try {
        const user = JSON.parse(storedUser);
        return user?.token || null;
    } catch {
        return null;
    }
};

export const fetchAdminPermissions = async () => {
    try {
        const response = await apiClient.get('/admin/permissions');
        return unwrapCollection(response);
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getStoredUser = () => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        return null;
    }
};

export const setStoredUser = (userData) => {
    const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(userData));
    window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
};

export const clearStoredUser = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
};

export const getAuthStorageEventName = () => AUTH_STORAGE_EVENT;

export const getCurrentUserProfile = () => getStoredUser()?.user || null;

export const getPrimaryRole = () => {
    const user = getCurrentUserProfile();

    if (user?.is_admin) {
        return 'admin';
    }

    if (user?.is_teacher) {
        return 'teacher';
    }

    if (user?.is_learner) {
        return 'learner';
    }

    return user?.roles?.[0]?.name || null;
};

const getPermissionName = (permission) =>
    typeof permission === 'string' ? permission : permission?.name;

export const getCurrentUserPermissions = () => {
    const user = getCurrentUserProfile();

    const permissionNames = Array.isArray(user?.permission_names)
        ? user.permission_names
        : [
            ...(user?.permissions ?? []).map(getPermissionName),
            ...(user?.direct_permissions ?? []).map(getPermissionName),
        ];

    return [...new Set(permissionNames.filter(Boolean))];
};

export const hasStoredPermission = (permission) =>
    getCurrentUserPermissions().includes(permission);

export const hasAnyStoredPermission = (permissions = []) =>
    permissions.some((permission) => hasStoredPermission(permission));

export const canManageQuizzes = () => {
    const role = getPrimaryRole();

    return role === 'admin'
        || role === 'teacher'
        || hasStoredPermission('create_quiz');
};

export const canManageUsers = () => {
    const role = getPrimaryRole();

    return role === 'admin'
        || hasAnyStoredPermission(['view_user', 'edit_user', 'manage_roles']);
};

