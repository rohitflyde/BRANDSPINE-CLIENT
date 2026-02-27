// src/pages/ThemeSelection.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, Sparkles, ArrowRight, Upload, X, Loader } from 'lucide-react';
import api from '../services/api';

interface Theme {
    _id: string;
    name: string;
    description: string;
    thumbnail: string;
    category: string;
    previewColors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
    usageCount: number;
}

export default function ThemeSelection() {
    const navigate = useNavigate();
    const { user, completeOnboarding, refreshBrand, isFirstTimeUser } = useAuth();
    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [brandName, setBrandName] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [category, setCategory] = useState<string>('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirect if not first time user
    useEffect(() => {
        if (!isFirstTimeUser) {
            navigate('/editor', { replace: true });
        }
    }, [isFirstTimeUser, navigate]);

    useEffect(() => {
        fetchThemes();
    }, [category]);

    const fetchThemes = async () => {
        setLoading(true);
        try {
            const url = category === 'all' ? '/themes' : `/themes?category=${category}`;
            const response = await api.get(url);
            setThemes(response.data);

            // Auto-select first theme if none selected
            if (response.data.length > 0 && !selectedTheme) {
                setSelectedTheme(response.data[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch themes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Logo size must be less than 2MB');
            return;
        }

        setLogoFile(file);
        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadLogo = async (): Promise<string | null> => {
        if (!logoFile) return null;

        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('image', logoFile);
        formData.append('folder', 'brands/logos/primary');

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const response = await api.post('/upload', formData);

            clearInterval(progressInterval);

            if (!response.data) {
                throw new Error('Upload failed');
            }

            const data = response.data;
            setUploadProgress(100);

            // Wait a moment to show 100%
            await new Promise(resolve => setTimeout(resolve, 500));

            return data.url;
        } catch (error) {
            console.error('Logo upload failed:', error);
            alert('Failed to upload logo. Please try again.');
            return null;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleApplyTheme = async () => {
        if (!selectedTheme) return;

        setApplying(true);
        try {
            // Upload logo first if selected
            let logoUrl = null;
            if (logoFile) {
                logoUrl = await uploadLogo();
                if (!logoUrl) {
                    // If logo upload failed, ask user if they want to continue without logo
                    const continueWithoutLogo = window.confirm(
                        'Logo upload failed. Do you want to continue without a logo?'
                    );
                    if (!continueWithoutLogo) {
                        setApplying(false);
                        return;
                    }
                }
            }

            // Apply theme with logo URL
            await api.post('/themes/apply', {
                themeId: selectedTheme,
                brandName: brandName.trim() || 'My Brand',
                logoUrl: logoUrl // Pass the uploaded logo URL
            });

            // Mark onboarding as complete
            completeOnboarding();

            // Refresh brand data
            await refreshBrand();

            // Navigate to editor
            navigate('/editor', { replace: true });
        } catch (error) {
            console.error('Failed to apply theme:', error);
        } finally {
            setApplying(false);
        }
    };

    const categories = [
        { id: 'all', label: 'All Themes' },
        { id: 'modern', label: 'Modern' },
        { id: 'classic', label: 'Classic' },
        { id: 'minimal', label: 'Minimal' },
        { id: 'bold', label: 'Bold' },
        { id: 'elegant', label: 'Elegant' }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="w-full border-b border-gray-700 bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">

                    {/* Left Side */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome, {user?.email}!
                        </h1>
                        <p className="text-gray-400">
                            Choose a theme and upload your logo to get started.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/editor')}
                            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Skip for now
                        </button>

                        <button
                            onClick={handleApplyTheme}
                            disabled={!selectedTheme || applying || isUploading}
                            className={`
          flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors
          ${selectedTheme && !applying && !isUploading
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }
        `}
                        >
                            {isUploading ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    <span>Uploading Logo...</span>
                                </>
                            ) : applying ? (
                                <>
                                    <Sparkles size={16} className="animate-spin" />
                                    <span>Applying Theme...</span>
                                </>
                            ) : (
                                <>
                                    <span>Apply Theme</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Brand Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Brand Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Brand Name <span className="text-gray-500">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="e.g., Acme Corporation"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Brand Logo <span className="text-gray-500">(optional)</span>
                        </label>
                        {!logoPreview ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-700 rounded-lg p-2 text-center cursor-pointer hover:border-blue-500 transition-colors"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoSelect}
                                    className="hidden"
                                />
                                <Upload className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                                <p className="text-sm text-gray-400">Click to upload your logo</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 2MB</p>
                            </div>
                        ) : (
                            <div className="relative bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="max-h-16 object-contain mx-auto"
                                />
                                <button
                                    onClick={handleRemoveLogo}
                                    className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                                    title="Remove logo"
                                >
                                    <X size={14} />
                                </button>

                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-700 rounded-full h-1">
                                            <div
                                                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 text-center mt-1">
                                            Uploading... {uploadProgress}%
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${category === cat.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Theme Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {themes.map((theme) => (
                                <div
                                    key={theme._id}
                                    onClick={() => setSelectedTheme(theme._id)}
                                    className={`
                                        relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer
                                        transition-all duration-200 hover:scale-105
                                        ${selectedTheme === theme._id ? 'ring-4 ring-blue-500' : 'border border-gray-700'}
                                    `}
                                >
                                    {/* Theme Preview */}
                                    <div className="aspect-video relative">
                                        <img
                                            src={theme.thumbnail}
                                            alt={theme.name}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Color Preview Strip */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
                                            <div style={{ backgroundColor: theme.previewColors.primary }} className="flex-1" />
                                            <div style={{ backgroundColor: theme.previewColors.secondary }} className="flex-1" />
                                            <div style={{ backgroundColor: theme.previewColors.accent }} className="flex-1" />
                                            <div style={{ backgroundColor: theme.previewColors.background }} className="flex-1" />
                                        </div>

                                        {/* Selected Badge */}
                                        {selectedTheme === theme._id && (
                                            <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                                                <Check size={16} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Theme Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold mb-1">{theme.name}</h3>
                                        <p className="text-sm text-gray-400 mb-2">{theme.description}</p>

                                        {/* Category Tag */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300 capitalize">
                                                {theme.category}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {theme.usageCount} uses
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No Themes Message */}
                        {themes.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400">No themes found in this category.</p>
                            </div>
                        )}
                    </>
                )}



                {/* Preview of where logo will go */}
                {logoPreview && (
                    <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Logo Preview in Theme</h3>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                <img src={logoPreview} alt="Logo" className="max-w-8 max-h-8 object-contain" />
                            </div>
                            <div className="flex-1">
                                <div className="h-2 w-24 bg-gray-700 rounded mb-2"></div>
                                <div className="h-2 w-32 bg-gray-700 rounded"></div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Your logo will be set as the primary logo in the identity section.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}