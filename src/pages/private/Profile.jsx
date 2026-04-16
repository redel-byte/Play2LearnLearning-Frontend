import React, { useEffect, useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'
import { fetchAuthenticatedUser, updateMyProfile } from '../../api/auth'
import { getCurrentUserProfile } from '../../api/userManagment'
import { useValidation } from '../../hooks/useValidation'
import { profileSchema } from '../../validation/profile.shema'

const mapUserToForm = (user) => ({
  firstName: user?.first_name || '',
  lastName: user?.last_name || '',
  email: user?.email || '',
})

const mapUserToOverview = (user) => ({
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

const mapBackendFieldToFormField = (field) => {
  switch (field) {
    case 'first_name':
      return 'firstName'
    case 'last_name':
      return 'lastName'
    default:
      return field
  }
}

const Profile = () => {
  const [user, setUser] = useState(getCurrentUserProfile())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isDirty },
  } = useValidation(profileSchema, {
    defaultValues: mapUserToForm(getCurrentUserProfile()),
  })

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      try {
        const nextUser = await fetchAuthenticatedUser()
        setUser(nextUser)
        reset(mapUserToForm(nextUser))
      } catch (error) {
        toast.error(error.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [reset])

  const watchedValues = watch()
  const overview = mapUserToOverview(user)
  const fullName = [watchedValues.firstName, watchedValues.lastName].filter(Boolean).join(' ') || 'Play2Learn User'
  const initials = (watchedValues.firstName?.[0] || watchedValues.email?.[0] || 'U').toUpperCase()
  const roles = getRoleList(user)
  const permissions = user?.permission_names || []
  const overviewCards = [
    { label: 'Account status', value: overview.status },
    { label: 'Primary role', value: overview.role },
    { label: 'Roles assigned', value: `${roles.length}` },
    { label: 'Permissions', value: `${permissions.length}` },
  ]
  const detailItems = [
    { label: 'User ID', value: user?.id || 'Not available' },
    { label: 'Joined', value: formatDate(user?.created_at, 'Not recorded') },
    { label: 'Last login', value: formatDate(user?.last_login_at, 'Never') },
    { label: 'Email verified', value: readBooleanLabel(Boolean(user?.email_verified_at)) },
  ]

  const handleCancel = () => {
    reset(mapUserToForm(user))
    toast('Profile changes discarded')
  }

  const handleSave = async (data) => {
    setSaving(true)

    try {
      const result = await updateMyProfile({
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim(),
      })

      setUser(result.user)
      reset(mapUserToForm(result.user))
      toast.success(result.message)
    } catch (error) {
      const validationErrors = error?.errors || error?.response?.data?.errors || {}

      Object.entries(validationErrors).forEach(([field, messages]) => {
        const formField = mapBackendFieldToFormField(field)
        const message = Array.isArray(messages) ? messages[0] : messages

        setError(formField, {
          type: 'server',
          message,
        })
      })

      toast.error(error?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const sessionSyncMessage = useMemo(() => {
    if (user?.email_verified_at) {
      return 'This page refreshes from the authenticated backend session, and profile edits update your stored session immediately.'
    }

    return 'This page refreshes from the authenticated backend session. If you change your email, verification status is cleared until the new address is verified.'
  }, [user?.email_verified_at])

  return (
    <div className="min-h-screen z-50 relative py-12 ">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-3xl overflow-hidden border border-slate-200">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-blue-100 mt-2">Update your account details and keep your session data in sync.</p>
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
                        <p className="text-slate-600 break-all">{watchedValues.email || 'No email address available'}</p>
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

                    <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit(handleSave)}>
                      <Input
                        name="firstName"
                        label="First Name"
                        type="text"
                        placeholder="Enter your first name"
                        error={errors.firstName?.message}
                        {...register('firstName')}
                      />
                      <Input
                        name="lastName"
                        label="Last Name"
                        type="text"
                        placeholder="Enter your last name"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          name="email"
                          label="Email"
                          type="email"
                          placeholder="Enter your email address"
                          error={errors.email?.message}
                          {...register('email')}
                        />
                      </div>

                      <div className="sm:col-span-2 flex justify-end gap-4 pt-2">
                        <Button
                          textContent="Reload"
                          variant="secondary"
                          onClick={handleCancel}
                          disabled={!isDirty || saving}
                        />
                        <Button
                          textContent={saving ? 'Saving...' : 'Save Profile'}
                          type="submit"
                          loading={saving}
                          disabled={!isDirty || saving}
                        />
                      </div>
                    </form>
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
                        {overview.status}
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
                        {sessionSyncMessage}
                      </div>
                    </div>
                  </div>
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
