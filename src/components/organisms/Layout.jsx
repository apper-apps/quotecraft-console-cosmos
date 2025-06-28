import React, { useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '@/App'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)

  const navigationItems = [
    {
      path: '/',
      label: 'Quotations',
      icon: 'FileText',
      description: 'Create and manage quotations'
    },
    {
      path: '/templates',
      label: 'Templates',
      icon: 'Layout',
      description: 'Manage quotation templates'
    },
    {
      path: '/products',
      label: 'Products',
      icon: 'Package',
      description: 'Manage product inventory'
    }
  ]

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-surface-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                        : 'text-surface-700 hover:bg-surface-50 hover:text-surface-900'
                      }
                    `}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      size={20} 
                      className={isActive ? 'text-primary-600' : 'text-surface-500'} 
                    />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-surface-500">{item.description}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout