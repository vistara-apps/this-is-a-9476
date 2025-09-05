import React, { useState } from 'react'
import { 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  Smartphone,
  Mail,
  Save,
  Check,
  Crown
} from 'lucide-react'

const SettingsView = () => {
  const [notifications, setNotifications] = useState({
    earnings: true,
    insights: true,
    learning: false,
    marketing: false
  })

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    timezone: 'America/New_York'
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {[
                { id: 'profile', name: 'Profile', icon: User },
                { id: 'notifications', name: 'Notifications', icon: Bell },
                { id: 'billing', name: 'Billing', icon: CreditCard },
                { id: 'security', name: 'Security', icon: Shield },
              ].map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-bg transition-colors text-text-primary"
                  >
                    <Icon size={18} />
                    {item.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <User size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-text-primary">Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-bg border border-border rounded-md px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-bg border border-border rounded-md px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Timezone
                </label>
                <select 
                  value={profile.timezone}
                  onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="America/New_York">Eastern Time (UTC-5)</option>
                  <option value="America/Chicago">Central Time (UTC-6)</option>
                  <option value="America/Denver">Mountain Time (UTC-7)</option>
                  <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-text-primary">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'earnings', label: 'Earnings Updates', desc: 'Get notified about new earnings and milestones' },
                { key: 'insights', label: 'Performance Insights', desc: 'Weekly performance summaries and recommendations' },
                { key: 'learning', label: 'Learning Recommendations', desc: 'New learning content based on your data' },
                { key: 'marketing', label: 'Product Updates', desc: 'Feature announcements and platform news' }
              ].map(item => (
                <div key={item.key} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-text-primary">{item.label}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(item.key)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${notifications[item.key] ? 'bg-primary' : 'bg-border'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard size={20} className="text-primary" />
              <h2 className="text-xl font-bold text-text-primary">Billing & Subscription</h2>
            </div>
            
            <div className="space-y-4">
              {/* Current Plan */}
              <div className="p-4 bg-bg border border-border rounded-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown size={18} className="text-accent" />
                    <span className="font-semibold text-text-primary">Pro Plan</span>
                  </div>
                  <span className="text-lg font-bold text-text-primary">$25/month</span>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Advanced analytics, learning pathways, and priority support
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="btn-secondary">Change Plan</button>
                  <button className="btn-secondary text-red-500 border-red-500/20 hover:bg-red-500/10">
                    Cancel Subscription
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-medium text-text-primary mb-3">Payment Method</h3>
                <div className="p-4 bg-bg border border-border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                      <div>
                        <p className="font-medium text-text-primary">•••• •••• •••• 4242</p>
                        <p className="text-sm text-text-secondary">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="btn-secondary">Update</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className={`
                btn-primary flex items-center gap-2 transition-all
                ${saved ? 'bg-green-500 hover:bg-green-500' : ''}
              `}
            >
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsView