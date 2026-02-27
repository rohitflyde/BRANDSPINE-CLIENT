// components/BrandSwitcher.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Plus, ChevronDown, Globe, Key, Loader } from 'lucide-react';
import api from '../services/api';

interface Brand {
    id: string;
    name: string;
    slug: string;
    publicId: string;
    isActive: boolean;
    description?: string;
    preview?: {
        logo?: string;
        primaryColor?: string;
    };
    apiKeysCount: number;
}

export default function BrandSwitcher() {
    const { brand: activeBrand, switchBrand, isLoading } = useAuth();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [newBrandDescription, setNewBrandDescription] = useState('');
    const [switchingBrandId, setSwitchingBrandId] = useState<string | null>(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    // Refresh brands list when active brand changes
    useEffect(() => {
        if (activeBrand) {
            fetchBrands();
        }
    }, [activeBrand]);

    const fetchBrands = async () => {
        try {
            const response = await api.get('/brand/user/all',);
            const data = response.data;
            setBrands(data);
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        }
    };

    const handleSwitchBrand = async (brandId: string) => {
        if (brandId === activeBrand?.brand?.id) {
            setIsOpen(false);
            return;
        }

        setSwitchingBrandId(brandId);
        try {
            await switchBrand(brandId);
            // The page will reload automatically from the context
        } catch (error) {
            console.error('Failed to switch brand:', error);
            setSwitchingBrandId(null);
        }
    };

    const createBrand = async () => {
        if (!newBrandName.trim()) return;

        try {
            const response = await api.post('/brand/user/create', {
                name: newBrandName,
                description: newBrandDescription
            });

            const data = response.data

            // Show the API key in a modal
            alert(`✨ Brand Created Successfully!\n\nAPI Key: ${data.apiKey.key}\n\nSave this key - it won't be shown again!`);

            setNewBrandName('');
            setNewBrandDescription('');
            setShowCreateModal(false);

            // Refresh brands list
            await fetchBrands();
        } catch (error) {
            console.error('Failed to create brand:', error);
            alert('Failed to create brand');
        }
    };

    // Get current active brand name
    const currentBrandName = activeBrand?.brand?.name || 'Select Brand';

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isLoading}
                    className={`flex items-center space-x-2 w-full px-3 py-2 bg-gray-700 rounded-lg transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                        }`}
                >
                    {isLoading && switchingBrandId ? (
                        <div className="flex items-center space-x-2">
                            <Loader size={16} className="animate-spin" />
                            <span className="text-sm">Switching...</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium truncate">{currentBrandName}</p>
                                <p className="text-xs text-gray-400">Active Brand</p>
                            </div>
                            <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </>
                    )}
                </button>

                {isOpen && !isLoading && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute left-0 right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-20">
                            <div className="p-2 max-h-96 overflow-y-auto ">
                                {brands.map((brand) => (

                                    <div
                                        key={brand.id}
                                        className="mt-2"
                                    >

                                        <button
                                            onClick={() => handleSwitchBrand(brand.id)}
                                            disabled={switchingBrandId === brand.id}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${brand.isActive
                                                ? 'bg-emerald-900 text-white'
                                                : 'hover:bg-gray-700 text-gray-300'
                                                } ${switchingBrandId === brand.id ? 'opacity-50 cursor-wait' : ''}`}
                                        >
                                            {/* Brand Preview */}
                                            <div className="flex-shrink-0">
                                                {brand.preview?.logo ? (
                                                    <img
                                                        src={brand.preview.logo}
                                                        alt=""
                                                        className="w-8 h-8 rounded object-contain bg-white"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                                                        style={{ backgroundColor: brand.preview?.primaryColor || '#3B82F6' }}
                                                    >
                                                        {brand.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Brand Info */}
                                            <div className="flex-1 text-left">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm font-medium">{brand.name}</p>
                                                    {switchingBrandId === brand.id && (
                                                        <Loader size={12} className="animate-spin" />
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs opacity-75">
                                                    <Globe size={10} />
                                                    <span className="truncate max-w-[100px]">{brand.publicId}</span>
                                                    <Key size={10} />
                                                    <span>{brand.apiKeysCount}</span>
                                                </div>
                                            </div>

                                            {/* Active Indicator */}
                                            {brand.isActive && <Check size={16} />}
                                        </button>
                                    </div>

                                ))}

                                {/* Create New Brand Button */}
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setShowCreateModal(true);
                                    }}
                                    className="w-full flex items-center space-x-2 px-3 py-2 mt-2 border-t border-gray-700 text-blue-400 hover:text-blue-300"
                                >
                                    <Plus size={16} />
                                    <span className="text-sm">Create New Brand</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Create Brand Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Create New Brand</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Brand Name *</label>
                                <input
                                    type="text"
                                    value={newBrandName}
                                    onChange={(e) => setNewBrandName(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., My Second Brand"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description (Optional)</label>
                                <textarea
                                    value={newBrandDescription}
                                    onChange={(e) => setNewBrandDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Brief description of this brand"
                                    rows={3}
                                />
                            </div>

                            <div className="bg-blue-500/10 p-3 rounded-lg">
                                <p className="text-sm text-blue-400">
                                    ✨ Each brand gets its own unique API key. Make sure to save it after creation.
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createBrand}
                                    disabled={!newBrandName.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Create Brand
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}