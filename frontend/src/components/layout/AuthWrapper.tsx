"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSentinelStore } from '@/lib/store'
import axios from 'axios'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { token, logout } = useSentinelStore()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Inject Axios Interceptor globally if token exists
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    
    // Handle 401s to auto-logout
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
          router.push('/login')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(interceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [token, logout, router])

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) return null

  // Allow access to login page
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login'

  if (!token && !isLoginPage) {
    router.push('/login')
    return null
  }

  return <>{children}</>
}
