import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [valid, setValid] = useState(false)

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setChecking(false)
        return
      }

      try {
        const response = await fetch(
          'http://localhost:5000/api/assessment/latest',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        // 401 means the JWT is invalid/expired
        if (response.status === 401) {
          localStorage.removeItem('token')
          setValid(false)
        } else {
          setValid(true)
        }
      } catch (error) {
        console.error('Token verification error:', error)

        // Don't kick the user out just because the backend
        // temporarily isn't reachable.
        setValid(true)
      } finally {
        setChecking(false)
      }
    }

    checkToken()
  }, [location.pathname])

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Checking session...</p>
      </div>
    )
  }

  if (!valid) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute