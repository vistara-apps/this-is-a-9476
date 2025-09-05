import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import DashboardView from './components/DashboardView'
import InsightsView from './components/InsightsView'
import LearnView from './components/LearnView'
import SettingsView from './components/SettingsView'
import AuthView from './components/AuthView'
import LoadingSpinner from './components/LoadingSpinner'
import { useAuth } from './contexts/AuthContext'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Main App Content Component
const AppContent = () => {
  const { user, loading } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show auth view if user is not authenticated
  if (!user) {
    return <AuthView />
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />
      case 'insights':
        return <InsightsView />
      case 'learn':
        return <LearnView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 lg:ml-64">
        <div className="dashboard-layout py-6">
          {renderView()}
        </div>
      </main>
    </div>
  )
}

// Root App Component with Providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
