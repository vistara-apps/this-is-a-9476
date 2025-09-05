import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import DashboardView from './components/DashboardView'
import InsightsView from './components/InsightsView'
import LearnView from './components/LearnView'
import SettingsView from './components/SettingsView'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

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
        <div className="p-4 lg:p-6">
          {renderView()}
        </div>
      </main>
    </div>
  )
}

export default App