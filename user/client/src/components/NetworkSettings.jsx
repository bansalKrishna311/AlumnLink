import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Shield, Users, Bell, Calendar, Save, RefreshCw } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';

const NetworkSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      networkName: 'Alumni Network',
      description: 'Connect with fellow alumni and stay updated with network activities',
      visibility: 'public',
      allowGuestViewing: true
    },
    privacy: {
      profileVisibility: 'network',
      showEmailAddresses: false,
      allowDirectMessages: true,
      requireApprovalForPosts: false
    },
    moderation: {
      autoModeratePosts: false,
      requireApprovalForNewMembers: true,
      allowAnonymousPosts: false,
      flagThreshold: 3
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      eventReminders: true
    },
    events: {
      allowEventCreation: true,
      requireApprovalForEvents: true,
      maxEventDuration: 7,
      allowRecurringEvents: false
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // This would be your actual API endpoint for network settings
      const response = await axiosInstance.get('/network/settings');
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching network settings:', error);
      // Keep default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // This would be your actual API call
      await axiosInstance.put('/network/settings', settings);
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      fetchSettings();
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'events', label: 'Events', icon: Calendar }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#fe6019]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Network Settings</h1>
              <p className="text-gray-600">Configure network preferences and behavior</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Settings Content */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Network Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Network Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.networkName}
                      onChange={(e) => handleSettingChange('general', 'networkName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility
                    </label>
                    <select
                      value={settings.general.visibility}
                      onChange={(e) => handleSettingChange('general', 'visibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="invite-only">Invite Only</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={settings.general.description}
                      onChange={(e) => handleSettingChange('general', 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowGuestViewing"
                        checked={settings.general.allowGuestViewing}
                        onChange={(e) => handleSettingChange('general', 'allowGuestViewing', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowGuestViewing" className="ml-2 block text-sm text-gray-900">
                        Allow guest users to view network content
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="public">Public</option>
                      <option value="network">Network Members Only</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showEmailAddresses"
                        checked={settings.privacy.showEmailAddresses}
                        onChange={(e) => handleSettingChange('privacy', 'showEmailAddresses', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showEmailAddresses" className="ml-2 block text-sm text-gray-900">
                        Show email addresses to other members
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowDirectMessages"
                        checked={settings.privacy.allowDirectMessages}
                        onChange={(e) => handleSettingChange('privacy', 'allowDirectMessages', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowDirectMessages" className="ml-2 block text-sm text-gray-900">
                        Allow direct messages between members
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requireApprovalForPosts"
                        checked={settings.privacy.requireApprovalForPosts}
                        onChange={(e) => handleSettingChange('privacy', 'requireApprovalForPosts', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requireApprovalForPosts" className="ml-2 block text-sm text-gray-900">
                        Require approval for all posts
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Moderation Settings */}
          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Content Moderation</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoModeratePosts"
                        checked={settings.moderation.autoModeratePosts}
                        onChange={(e) => handleSettingChange('moderation', 'autoModeratePosts', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoModeratePosts" className="ml-2 block text-sm text-gray-900">
                        Enable automatic content moderation
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requireApprovalForNewMembers"
                        checked={settings.moderation.requireApprovalForNewMembers}
                        onChange={(e) => handleSettingChange('moderation', 'requireApprovalForNewMembers', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requireApprovalForNewMembers" className="ml-2 block text-sm text-gray-900">
                        Require approval for new member requests
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowAnonymousPosts"
                        checked={settings.moderation.allowAnonymousPosts}
                        onChange={(e) => handleSettingChange('moderation', 'allowAnonymousPosts', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowAnonymousPosts" className="ml-2 block text-sm text-gray-900">
                        Allow anonymous posts
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flag Threshold for Auto-Hide
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.moderation.flagThreshold}
                      onChange={(e) => handleSettingChange('moderation', 'flagThreshold', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Number of flags before content is automatically hidden
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                        Send email notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pushNotifications"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-900">
                        Send push notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="weeklyDigest"
                        checked={settings.notifications.weeklyDigest}
                        onChange={(e) => handleSettingChange('notifications', 'weeklyDigest', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="weeklyDigest" className="ml-2 block text-sm text-gray-900">
                        Send weekly digest emails
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="eventReminders"
                        checked={settings.notifications.eventReminders}
                        onChange={(e) => handleSettingChange('notifications', 'eventReminders', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="eventReminders" className="ml-2 block text-sm text-gray-900">
                        Send event reminders
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Event Settings */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Event Management</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowEventCreation"
                        checked={settings.events.allowEventCreation}
                        onChange={(e) => handleSettingChange('events', 'allowEventCreation', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowEventCreation" className="ml-2 block text-sm text-gray-900">
                        Allow members to create events
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requireApprovalForEvents"
                        checked={settings.events.requireApprovalForEvents}
                        onChange={(e) => handleSettingChange('events', 'requireApprovalForEvents', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requireApprovalForEvents" className="ml-2 block text-sm text-gray-900">
                        Require approval for new events
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowRecurringEvents"
                        checked={settings.events.allowRecurringEvents}
                        onChange={(e) => handleSettingChange('events', 'allowRecurringEvents', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowRecurringEvents" className="ml-2 block text-sm text-gray-900">
                        Allow recurring events
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Event Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.events.maxEventDuration}
                      onChange={(e) => handleSettingChange('events', 'maxEventDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum number of days an event can span
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Save Status */}
      {hasChanges && (
        <motion.div
          className="fixed bottom-6 right-6 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>You have unsaved changes</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NetworkSettings;
