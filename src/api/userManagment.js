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

export const getUserPrimaryRole = (user) => {
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

export const getPrimaryRole = () => getUserPrimaryRole(getCurrentUserProfile());

const getPermissionName = (permission) =>
    typeof permission === 'string' ? permission : permission?.name;

export const getUserPermissions = (user) => {
    const permissionNames = Array.isArray(user?.permission_names)
        ? user.permission_names
        : [
            ...(user?.permissions ?? []).map(getPermissionName),
            ...(user?.direct_permissions ?? []).map(getPermissionName),
        ];

    return [...new Set(permissionNames.filter(Boolean))];
};

export const getCurrentUserPermissions = () => getUserPermissions(getCurrentUserProfile());

export const userHasPermission = (user, permission) =>
    getUserPermissions(user).includes(permission);

export const hasStoredPermission = (permission) =>
    userHasPermission(getCurrentUserProfile(), permission);

export const userHasAnyPermission = (user, permissions = []) =>
    permissions.some((permission) => userHasPermission(user, permission));

export const hasAnyStoredPermission = (permissions = []) =>
    userHasAnyPermission(getCurrentUserProfile(), permissions);

export const userCanManageQuizzes = (user) => {
    const role = getUserPrimaryRole(user);

    return role === 'admin'
        || role === 'teacher'
        || userHasPermission(user, 'create_quiz');
};

export const canManageQuizzes = () => userCanManageQuizzes(getCurrentUserProfile());

export const userCanManageUsers = (user) => {
    const role = getUserPrimaryRole(user);

    return role === 'admin'
        || userHasAnyPermission(user, ['view_user', 'edit_user', 'manage_roles']);
};

export const canManageUsers = () => userCanManageUsers(getCurrentUserProfile());

