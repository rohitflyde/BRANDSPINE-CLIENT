// components/ApiKeyManager.tsx
import React, { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff, RotateCcw, Trash2, Key, Clock, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface ApiKey {
    id: string;
    name: string;
    permissions: string[];
    status: string;
    lastUsedAt: string | null;
    keyPreview: string;
    fullKey?: string;
    createdAt: string;
}

interface ApiKeyManagerProps {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    setIsLoading: (loading: boolean) => void;
}

export default function ApiKeyManager({ showSuccess, showError, setIsLoading }: ApiKeyManagerProps) {
    const { brand } = useAuth();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [showFullKey, setShowFullKey] = useState<Record<string, boolean>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/brand/user/keys');
            const data = response.data;
            setKeys(data);
        } catch (error) {
            showError('Failed to fetch API keys');
        } finally {
            setIsLoading(false);
        }
    };

    const createApiKey = async () => {
        if (!newKeyName.trim()) {
            showError('Please enter a key name');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/brand/user/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newKeyName,
                    permissions: ['read', 'write', 'admin'] // Always full permissions
                })
            });

            const newKey = await response.json();

            setNewlyCreatedKey(newKey);
            setKeys(prev => [newKey, ...prev]);
            setShowCreateForm(false);
            setNewKeyName('');

            showSuccess('API key created successfully');
        } catch (error) {
            showError('Failed to create API key');
        } finally {
            setIsLoading(false);
        }
    };

    const regenerateKey = async (keyId: string) => {
        if (!confirm('Are you sure you want to regenerate this key? The old key will stop working immediately.')) {
            return;
        }

        setRegenerating(true);
        setIsLoading(true);

        try {
            // First revoke the old key
            await fetch(`/api/keys/${keyId}/revoke`, { method: 'PATCH' });

            // Then create a new one with the same name
            const oldKey = keys.find(k => k.id === keyId);
            const response = await fetch('/api/brand/user/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: oldKey?.name || 'Regenerated Key',
                    permissions: ['read', 'write', 'admin']
                })
            });

            const newKey = await response.json();

            // Update the list
            setKeys(prev => prev.filter(k => k.id !== keyId));
            setNewlyCreatedKey(newKey);

            showSuccess('API key regenerated successfully');
        } catch (error) {
            showError('Failed to regenerate API key');
        } finally {
            setRegenerating(false);
            setIsLoading(false);
        }
    };

    const revokeKey = async (keyId: string) => {
        if (!confirm('Are you sure you want to revoke this key? It will immediately stop working.')) {
            return;
        }

        setIsLoading(true);
        try {
            await fetch(`/api/keys/${keyId}/revoke`, { method: 'PATCH' });
            await fetchApiKeys();
            showSuccess('API key revoked successfully');
        } catch (error) {
            showError('Failed to revoke API key');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteKey = async (keyId: string) => {
        if (!confirm('Are you sure you want to permanently delete this key? This action cannot be undone.')) {
            return;
        }

        setIsLoading(true);
        try {
            await fetch(`/api/keys/${keyId}`, { method: 'DELETE' });
            await fetchApiKeys();
            showSuccess('API key deleted successfully');
        } catch (error) {
            showError('Failed to delete API key');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, keyId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(keyId);
        setTimeout(() => setCopiedId(null), 2000);
        showSuccess('Copied to clipboard');
    };

    const toggleShowKey = (keyId: string) => {
        setShowFullKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold">API Keys</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Manage API keys for {brand?.name || 'your brand'}
                    </p>
                </div>

                <button
                    onClick={() => setShowCreateForm(true)}
                    disabled={keys.length >= 5} // Limit to 5 keys max
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${keys.length >= 5
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    title={keys.length >= 5 ? 'Maximum 5 keys allowed' : 'Create new key'}
                >
                    <Key size={18} />
                    <span>New API Key</span>
                </button>
            </div>

            {/* Key Limit Warning */}
            {keys.length >= 5 && (
                <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center space-x-2">
                    <AlertCircle size={18} className="text-yellow-400" />
                    <p className="text-sm text-yellow-400">Maximum of 5 API keys reached. Revoke or delete unused keys to create more.</p>
                </div>
            )}

            {/* Create Key Form */}
            {showCreateForm && (
                <div className="mb-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                    <h4 className="font-medium mb-4">Create New API Key</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Key Name</label>
                            <input
                                type="text"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="e.g., Production Website"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>

                        <div className="bg-blue-500/10 p-3 rounded-lg">
                            <p className="text-xs text-blue-400 flex items-center">
                                <Key size={14} className="mr-1" />
                                All keys have full read, write, and admin permissions
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createApiKey}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Create Key
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Newly Created Key Display */}
            {newlyCreatedKey && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-400 mb-3">
                        <Check size={20} />
                        <span className="font-medium">API Key Created Successfully</span>
                    </div>

                    <p className="text-sm text-gray-300 mb-2">
                        This is your only chance to copy this key. Store it securely!
                    </p>

                    <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                        <code className="font-mono text-sm break-all">{newlyCreatedKey.fullKey || newlyCreatedKey.key}</code>
                        <button
                            onClick={() => copyToClipboard(newlyCreatedKey.fullKey || newlyCreatedKey.key, 'new')}
                            className="p-2 hover:bg-gray-700 rounded flex-shrink-0 ml-2"
                        >
                            {copiedId === 'new' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                    </div>

                    <button
                        onClick={() => setNewlyCreatedKey(null)}
                        className="mt-3 text-sm text-gray-400 hover:text-white"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* API Keys List */}
            <div className="space-y-4">
                {keys.length === 0 ? (
                    <div className="text-center py-12 bg-gray-700/30 rounded-lg">
                        <Key size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">No API keys yet</p>
                        <p className="text-sm text-gray-500 mt-1">Create your first API key to get started</p>
                    </div>
                ) : (
                    keys.map((key) => (
                        <div
                            key={key.id}
                            className={`bg-gray-700/30 border rounded-lg p-4 ${key.status === 'active' ? 'border-gray-600' : 'border-red-500/30 opacity-60'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h4 className="font-medium">{key.name}</h4>
                                        <span className={`text-xs px-2 py-1 rounded ${key.status === 'active'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {key.status}
                                        </span>
                                        <div className="flex space-x-1">
                                            {key.permissions.map(perm => (
                                                <span
                                                    key={perm}
                                                    className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded"
                                                >
                                                    {perm}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                                        <span className="flex items-center space-x-1">
                                            <Clock size={12} />
                                            <span>Created: {formatDate(key.createdAt)}</span>
                                        </span>
                                        <span>Last used: {formatDate(key.lastUsedAt)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleShowKey(key.id)}
                                        className="p-2 hover:bg-gray-600 rounded"
                                        title={showFullKey[key.id] ? 'Hide key' : 'Show key'}
                                    >
                                        {showFullKey[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>

                                    <button
                                        onClick={() => copyToClipboard(key.keyPreview, key.id)}
                                        className="p-2 hover:bg-gray-600 rounded relative"
                                        title="Copy key"
                                    >
                                        {copiedId === key.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    </button>

                                    {key.status === 'active' ? (
                                        <>
                                            <button
                                                onClick={() => regenerateKey(key.id)}
                                                disabled={regenerating}
                                                className="p-2 hover:bg-yellow-600 rounded text-yellow-400 hover:text-white"
                                                title="Regenerate key"
                                            >
                                                <RotateCcw size={16} className={regenerating ? 'animate-spin' : ''} />
                                            </button>
                                            <button
                                                onClick={() => revokeKey(key.id)}
                                                className="p-2 hover:bg-orange-600 rounded text-orange-400 hover:text-white"
                                                title="Revoke key"
                                            >
                                                <Key size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => deleteKey(key.id)}
                                            className="p-2 hover:bg-red-600 rounded text-red-400 hover:text-white"
                                            title="Delete key"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 font-mono text-sm bg-gray-900 p-2 rounded break-all">
                                {showFullKey[key.id]
                                    ? key.fullKey || key.keyPreview.replace('...', '') + '(full key hidden for security)'
                                    : key.keyPreview
                                }
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="text-sm font-medium text-blue-400 mb-2">🔐 API Key Best Practices</h4>
                <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                    <li>Store keys securely - they're shown only once at creation</li>
                    <li>Use different keys for different environments (dev/staging/prod)</li>
                    <li>Regenerate keys immediately if you suspect they're compromised</li>
                    <li>Maximum 5 keys per brand - revoke unused ones</li>
                    <li>All keys have full read, write, and admin permissions</li>
                </ul>
            </div>
        </div>
    );
}