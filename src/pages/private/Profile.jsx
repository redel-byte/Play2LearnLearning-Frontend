import React, { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { fetchAuthenticatedUser, updateMyProfile } from '../../api/auth'
import { getCurrentUserProfile } from '../../api/userManagment'

const mapUserToForm = (user) => ({
  firstName: user?.first_name || '',
  lastName: user?.last_name || '',
  email: user?.email || '',
  role: user?.is_admin ? 'Admin' : user?.is_teacher ? 'Teacher' : 'Learner',
  status: user?.is_active ? 'Active' : 'Inactive',
})

const formatDate = (value, fallback = 'Not available') => {
  if (!value) {
    return fallback
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  return date.toLocaleString()
}

const formatRoleName = (role) => {
  if (!role) {
    return null
  }

  return role
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

const getRoleList = (user) => {
  const explicitRoles = (user?.roles || [])
    .map((role) => (typeof role === 'string' ? role : role?.name))
    .filter(Boolean)

  if (explicitRoles.length > 0) {
    return explicitRoles
  }

  const inferredRoles = []

  if (user?.is_admin) inferredRoles.push('admin')
  if (user?.is_teacher) inferredRoles.push('teacher')
  if (user?.is_learner || inferredRoles.length === 0) inferredRoles.push('learner')

  return inferredRoles
}

const readBooleanLabel = (value) => {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  return 'Unknown'
}

const Profile = () => {
  const [user, setUser] = useState(getCurrentUserProfile())
  const [formData, setFormData] = useState(mapUserToForm(getCurrentUserProfile()))
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      try {
        const nextUser = await fetchAuthenticatedUser()
        setUser(nextUser)
        setFormData(mapUserToForm(nextUser))
        setErrors({})
      } catch (error) {
        toast.error(error.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleCancel = () => {
    setFormData(mapUserToForm(user))
    setErrors({})
    toast('Profile reloaded')
  }

  const handleChange = (field) => (event) => {
    const value = event.target.value

    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  const hasChanges = (
    formData.firstName !== mapUserToForm(user).firstName
    || formData.lastName !== mapUserToForm(user).lastName
    || formData.email !== mapUserToForm(user).email
  )

  const handleSave = async () => {
    setSaving(true)
    setErrors({})

    try {
      const { user: updatedUser, message } = await updateMyProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      })

      setUser(updatedUser)
      setFormData(mapUserToForm(updatedUser))
      toast.success(message || 'Profile updated successfully')
    } catch (error) {
      if (error?.errors) {
        setErrors({
          firstName: error.errors.first_name?.[0],
          lastName: error.errors.last_name?.[0],
          email: error.errors.email?.[0],
        })
      }

      toast.error(error?.message || error?.error || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') || 'Play2Learn User'
  const initials = (formData.firstName?.[0] || formData.email?.[0] || 'U').toUpperCase()
  const roles = getRoleList(user)
  const permissions = user?.permission_names || []
  const overviewCards = [
    { label: 'Account status', value: formData.status },
    { label: 'Primary role', value: formData.role },
    { label: 'Roles assigned', value: `${roles.length}` },
    { label: 'Permissions', value: `${permissions.length}` },
  ]
  const detailItems = [
    { label: 'User ID', value: user?.id || 'Not available' },
    { label: 'Joined', value: formatDate(user?.created_at, 'Not recorded') },
    { label: 'Last login', value: formatDate(user?.last_login_at, 'Never') },
    { label: 'Email verified', value: readBooleanLabel(Boolean(user?.email_verified_at)) },
  ]

  return (
    <div className="min-h-screen z-50 relative py-12 ">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-3xl overflow-hidden border border-slate-200">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-blue-100 mt-2">Live account data synced from the backend session.</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-slate-900">{fullName}</h2>
                        <p className="text-slate-600 break-all">{formData.email || 'No email address available'}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {roles.map((role) => (
                            <span
                              key={role}
                              className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200"
                            >
                              {formatRoleName(role)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">First Name</div>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange('firstName')}
                          className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 ${
                            errors.firstName
                              ? 'border-red-300 focus:ring-red-200'
                              : 'border-slate-200 focus:ring-blue-200'
                          }`}
                          placeholder="First name"
                        />
                        {errors.firstName && (
                          <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Last Name</div>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange('lastName')}
                          className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 ${
                            errors.lastName
                              ? 'border-red-300 focus:ring-red-200'
                              : 'border-slate-200 focus:ring-blue-200'
                          }`}
                          placeholder="Last name"
                        />
                        {errors.lastName && (
                          <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-sm font-medium text-slate-500 mb-1">Email</div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={handleChange('email')}
                          className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 break-all focus:outline-none focus:ring-2 ${
                            errors.email
                              ? 'border-red-300 focus:ring-red-200'
                              : 'border-slate-200 focus:ring-blue-200'
                          }`}
                          placeholder="Email address"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</div>
                    <div className="mt-4 space-y-3">
                      {overviewCards.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                          <span className="text-sm text-slate-500">{item.label}</span>
                          <span className="text-sm font-semibold text-slate-900 text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Account details</h3>
                        <p className="text-sm text-slate-500 mt-1">Helpful metadata about your account and recent activity.</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        user?.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {formData.status}
                      </span>
                    </div>

                    <div className="mt-5 space-y-4">
                      {detailItems.map((item) => (
                        <div key={item.label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                          <span className="text-sm text-slate-500">{item.label}</span>
                          <span className="text-sm font-medium text-slate-900 text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-slate-900">Permissions</h3>
                    <p className="text-sm text-slate-500 mt-1">The backend currently grants these effective permissions to your account.</p>

                    <div className="mt-5">
                      {permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          No explicit permissions were returned. Access is currently role-based only.
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                      <div className="text-sm font-medium text-slate-900">Session sync</div>
                      <div className="mt-1 text-sm text-slate-600">
                        This page refreshes from the authenticated backend session so the information stays aligned with your latest account state.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <Button
                    textContent={saving ? 'Saving...' : 'Save Changes'}
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                  />
                  <Button
                    textContent="Reload"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
