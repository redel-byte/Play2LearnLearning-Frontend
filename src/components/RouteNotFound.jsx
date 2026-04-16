import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const RouteNotFound = () => {
  useEffect(() => {
    toast.error("Route doesn't exist.", {
      duration: 3000,
      style: {
        background: '#fee2e2',
        color: '#991b1b',
      },
    })
  }, [])

  return <Navigate to="/" replace />
}

export default RouteNotFound
