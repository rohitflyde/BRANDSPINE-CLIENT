// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiKeyManager from '../components/ApiKeyManager';
import { User, Building, Shield, Bell, Key, ChevronRight } from 'lucide-react';

type SettingsTab = 'profile' | 'tenant' | 'api-keys' | 'security' | 'notifications';

export default function Settings() {
    const { user, brand } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('api-keys'); // Default to API keys
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'tenant', label: 'Tenant Settings', icon: Building },
        { id: 'api-keys', label: 'API Keys', icon: Key },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 3000);
    };

    return (
        <div className="flex h-full bg-gray-900 text-white">
            {/* Settings Sidebar */}
            <div className="w-72 bg-gray-800 border-r border-gray-700 p-6">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>

                <nav className="space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as SettingsTab)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                    ? 'bg-emerald-900 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon size={20} />
                                    <span className="text-sm font-medium">{tab.label}</span>
                                </div>
                                <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
                            </button>
                        );
                    })}
                </nav>

                {/* Current Brand Info */}
                {/* <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-2">ACTIVE BRAND</p>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                            <span className="text-sm font-bold">
                                {brand?.name?.charAt(0) || 'B'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{brand?.name || 'Default Brand'}</p>
                            <p className="text-xs text-gray-400">ID: {brand?.id?.slice(-6) || '...'}</p>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto py-8 px-6">
                    {/* Success/Error Messages */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                            {errorMessage}
                        </div>
                    )}

                    {/* Tab Content */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700">
                        {activeTab === 'profile' && (
                            <ProfileSettings
                                user={user}
                                showSuccess={showSuccess}
                                showError={showError}
                                setIsLoading={setIsLoading}
                            />
                        )}

                        {activeTab === 'tenant' && (
                            <TenantSettings
                                user={user}
                                showSuccess={showSuccess}
                                showError={showError}
                                setIsLoading={setIsLoading}
                            />
                        )}

                        {activeTab === 'api-keys' && (
                            <ApiKeyManager
                                showSuccess={showSuccess}
                                showError={showError}
                                setIsLoading={setIsLoading}
                            />
                        )}

                        {activeTab === 'security' && (
                            <SecuritySettings
                                user={user}
                                showSuccess={showSuccess}
                                showError={showError}
                                setIsLoading={setIsLoading}
                            />
                        )}

                        {activeTab === 'notifications' && (
                            <NotificationSettings
                                showSuccess={showSuccess}
                                showError={showError}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Profile Settings Component
function ProfileSettings({ user, showSuccess, showError, setIsLoading }: any) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // API call to update profile
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
            showSuccess('Profile updated successfully');
        } catch (error) {
            showError('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

// Tenant Settings Component
function TenantSettings({ user, showSuccess, showError, setIsLoading }: any) {
    const [formData, setFormData] = useState({
        name: user?.tenantId?.name || '',
        slug: user?.tenantId?.slug || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // API call to update tenant
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
            showSuccess('Tenant settings updated successfully');
        } catch (error) {
            showError('Failed to update tenant settings');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Tenant Settings</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Company Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your company name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Tenant Slug
                    </label>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-500">your-brand.com/</span>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="your-tenant"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        This will be used in your public URLs
                    </p>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Update Tenant
                </button>
            </form>
        </div>
    );
}

// Security Settings Component
function SecuritySettings({ user, showSuccess, showError, setIsLoading }: any) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            // API call to change password
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
            showSuccess('Password changed successfully');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showError('Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Security Settings</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Current Password
                    </label>
                    <input
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={8}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Change Password
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="text-lg font-medium mb-4">Two-Factor Authentication</h4>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    Enable 2FA
                </button>
            </div>
        </div>
    );
}

// Notification Settings Component
function NotificationSettings({ showSuccess, showError }: any) {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        apiKeyAlerts: true,
        brandUpdates: false,
        weeklyReports: true,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        showSuccess('Notification settings updated');
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Notification Settings</h3>

            <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive updates via email</p>
                    </div>
                    <button
                        onClick={() => handleToggle('emailNotifications')}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-emerald-500' : 'bg-gray-600'
                            }`}
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                        <p className="font-medium">API Key Alerts</p>
                        <p className="text-sm text-gray-400">Get notified when API keys are used</p>
                    </div>
                    <button
                        onClick={() => handleToggle('apiKeyAlerts')}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.apiKeyAlerts ? 'bg-emerald-500' : 'bg-gray-600'
                            }`}
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.apiKeyAlerts ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                        <p className="font-medium">Brand Updates</p>
                        <p className="text-sm text-gray-400">Notify when brand config changes</p>
                    </div>
                    <button
                        onClick={() => handleToggle('brandUpdates')}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.brandUpdates ? 'bg-emerald-500' : 'bg-gray-600'
                            }`}
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.brandUpdates ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-gray-400">Receive weekly usage reports</p>
                    </div>
                    <button
                        onClick={() => handleToggle('weeklyReports')}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.weeklyReports ? 'bg-emerald-500' : 'bg-gray-600'
                            }`}
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.weeklyReports ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </label>
            </div>
        </div>
    );
}