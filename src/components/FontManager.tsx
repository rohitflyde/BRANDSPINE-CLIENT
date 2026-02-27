// src/components/FontManager.tsx
import React, { useState, useEffect } from 'react';
import { useBrandStore } from '../store/brandStore';
import { Plus, Trash2, Upload, X, ChevronDown, ChevronUp, AlertCircle, Check, Loader, Type } from 'lucide-react';
import api from '../services/api';

interface FontSource {
    weight: number;
    style: 'normal' | 'italic';
    woff2?: string;
    woff?: string;
    ttf?: string;
}

interface FontFamily {
    id: string;
    label: string;
    family: string;
    fallback: string[];
    sources: FontSource[];
}

interface FontManagerProps {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    setIsLoading: (loading: boolean) => void;
}

const WEIGHT_OPTIONS = [
    { value: 100, label: 'Thin (100)' },
    { value: 200, label: 'Extra Light (200)' },
    { value: 300, label: 'Light (300)' },
    { value: 400, label: 'Regular (400)' },
    { value: 500, label: 'Medium (500)' },
    { value: 600, label: 'Semi Bold (600)' },
    { value: 700, label: 'Bold (700)' },
    { value: 800, label: 'Extra Bold (800)' },
    { value: 900, label: 'Black (900)' },
];

const STYLE_OPTIONS = [
    { value: 'normal', label: 'Normal' },
    { value: 'italic', label: 'Italic' },
];

export default function FontManager({ showSuccess, showError, setIsLoading }: FontManagerProps) {
    const { draft, updateDraft, saveBrand, isDirty } = useBrandStore();
    const [fontFamilies, setFontFamilies] = useState<Record<string, FontFamily>>({});
    const [expandedFonts, setExpandedFonts] = useState<Set<string>>(new Set());
    const [showAddFontModal, setShowAddFontModal] = useState(false);
    const [newFontData, setNewFontData] = useState<Partial<FontFamily>>({
        label: '',
        family: '',
        fallback: ['sans-serif'],
        sources: []
    });
    const [newSource, setNewSource] = useState<Partial<FontSource>>({
        weight: 400,
        style: 'normal'
    });
    const [uploadingFontId, setUploadingFontId] = useState<string | null>(null);
    const [uploadingWeight, setUploadingWeight] = useState<number | null>(null);
    const [uploadingStyle, setUploadingStyle] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (draft?.brand?.typography?.primitives?.fontFamilies) {
            setFontFamilies(draft.brand.typography.primitives.fontFamilies);
        }
    }, [draft]);

    const toggleExpand = (fontId: string) => {
        const newExpanded = new Set(expandedFonts);
        if (newExpanded.has(fontId)) {
            newExpanded.delete(fontId);
        } else {
            newExpanded.add(fontId);
        }
        setExpandedFonts(newExpanded);
    };

    const uploadFontFile = async (
        file: File,
        fontId: string,
        weight: number,
        style: string,
        format: 'woff2' | 'woff' | 'ttf'
    ): Promise<string | null> => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', `fonts/${fontId}/${weight}_${style}`);

        try {
            setUploadingFontId(fontId);
            setUploadingWeight(weight);
            setUploadingStyle(style);
            setUploadProgress(0);

            // Simulate progress
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
            console.error('Font upload failed:', error);
            showError(`Failed to upload ${format.toUpperCase()} file`);
            return null;
        } finally {
            setUploadingFontId(null);
            setUploadingWeight(null);
            setUploadingStyle(null);
            setUploadProgress(0);
        }
    };

    const handleFontFileUpload = async (
        file: File,
        fontId: string,
        weight: number,
        style: string,
        format: 'woff2' | 'woff' | 'ttf'
    ) => {
        // Validate file type
        const expectedExtension = format === 'woff2' ? '.woff2' : format === 'woff' ? '.woff' : '.ttf';
        if (!file.name.toLowerCase().endsWith(expectedExtension)) {
            showError(`Please upload a valid ${format.toUpperCase()} file`);
            return;
        }

        // Validate file size (max 5MB for fonts)
        if (file.size > 5 * 1024 * 1024) {
            showError('Font file size must be less than 5MB');
            return;
        }

        const uploadedUrl = await uploadFontFile(file, fontId, weight, style, format);

        if (!uploadedUrl) return;

        // Get current sources
        const currentFont = fontFamilies[fontId];
        const sources = [...(currentFont?.sources || [])];

        // Find or create source
        let sourceIndex = sources.findIndex(s => s.weight === weight && s.style === style);

        if (sourceIndex >= 0) {
            // Update existing source
            sources[sourceIndex] = {
                ...sources[sourceIndex],
                [format]: uploadedUrl
            };
        } else {
            // Create new source
            sources.push({
                weight,
                style: style as 'normal' | 'italic',
                [format]: uploadedUrl
            });
        }

        // Update the draft
        updateDraft(
            ['brand', 'typography', 'primitives', 'fontFamilies', fontId, 'sources'],
            sources
        );

        // Update local state
        setFontFamilies(prev => ({
            ...prev,
            [fontId]: {
                ...prev[fontId],
                sources
            }
        }));

        showSuccess(`${format.toUpperCase()} uploaded successfully`);
    };

    const addFontFamily = () => {
        if (!newFontData.label || !newFontData.family) {
            showError('Font name and family are required');
            return;
        }

        const fontId = newFontData.family.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

        // Check if font ID already exists
        if (fontFamilies[fontId]) {
            showError('A font with this family name already exists');
            return;
        }

        const newFont: FontFamily = {
            id: fontId,
            label: newFontData.label,
            family: newFontData.family,
            fallback: newFontData.fallback || ['sans-serif'],
            sources: []
        };

        updateDraft(
            ['brand', 'typography', 'primitives', 'fontFamilies', fontId],
            newFont
        );

        setFontFamilies(prev => ({ ...prev, [fontId]: newFont }));
        setShowAddFontModal(false);
        setNewFontData({ label: '', family: '', fallback: ['sans-serif'], sources: [] });
        showSuccess('Font family added successfully');
    };

    const addFontSource = (fontId: string) => {
        if (!newSource.weight || !newSource.style) return;

        const sources = [...(fontFamilies[fontId]?.sources || [])];

        // Check if source already exists
        const exists = sources.some(s => s.weight === newSource.weight && s.style === newSource.style);
        if (exists) {
            showError('A source with this weight and style already exists');
            return;
        }

        sources.push({
            weight: newSource.weight as number,
            style: newSource.style as 'normal' | 'italic',
            woff2: '',
            woff: '',
            ttf: ''
        });

        updateDraft(
            ['brand', 'typography', 'primitives', 'fontFamilies', fontId, 'sources'],
            sources
        );

        setFontFamilies(prev => ({
            ...prev,
            [fontId]: {
                ...prev[fontId],
                sources
            }
        }));

        setNewSource({ weight: 400, style: 'normal' });
        showSuccess('Font source added');
    };

    const removeFontSource = (fontId: string, index: number) => {
        const sources = [...(fontFamilies[fontId]?.sources || [])];
        sources.splice(index, 1);

        updateDraft(
            ['brand', 'typography', 'primitives', 'fontFamilies', fontId, 'sources'],
            sources
        );

        setFontFamilies(prev => ({
            ...prev,
            [fontId]: {
                ...prev[fontId],
                sources
            }
        }));
    };

    const removeFontFamily = (fontId: string) => {
        if (confirm('Are you sure you want to remove this font family? This may affect text styles using this font.')) {
            updateDraft(
                ['brand', 'typography', 'primitives', 'fontFamilies', fontId],
                undefined
            );
            setFontFamilies(prev => {
                const newState = { ...prev };
                delete newState[fontId];
                return newState;
            });
        }
    };

    const updateFallback = (fontId: string, fallback: string[]) => {
        updateDraft(
            ['brand', 'typography', 'primitives', 'fontFamilies', fontId, 'fallback'],
            fallback
        );

        setFontFamilies(prev => ({
            ...prev,
            [fontId]: {
                ...prev[fontId],
                fallback
            }
        }));
    };

    const isUploading = (fontId: string, weight: number, style: string) => {
        return uploadingFontId === fontId && uploadingWeight === weight && uploadingStyle === style;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold">Custom Fonts</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Upload and manage custom font families
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowAddFontModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Font Family</span>
                    </button>

                    {isDirty && (
                        <button
                            onClick={() => saveBrand()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            {/* Font Families List */}
            <div className="space-y-4">
                {Object.entries(fontFamilies).map(([id, font]) => (
                    <div key={id} className="bg-gray-700/30 border border-gray-600 rounded-lg overflow-hidden">
                        {/* Font Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-700/50">
                            <div className="flex items-center space-x-4 flex-1">
                                <button
                                    onClick={() => toggleExpand(id)}
                                    className="p-1 hover:bg-gray-600 rounded"
                                >
                                    {expandedFonts.has(id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                <div>
                                    <h4 className="font-medium">{font.label}</h4>
                                    <p className="text-sm text-gray-400 font-mono">{font.family}</p>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                                        {font.fallback.join(', ')}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {font.sources?.length || 0} weight(s)
                                </div>
                            </div>
                            <button
                                onClick={() => removeFontFamily(id)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded"
                                title="Remove font family"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Expanded Content */}
                        {expandedFonts.has(id) && (
                            <div className="p-4 space-y-4">
                                {/* Fallback Fonts */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">
                                        Fallback Fonts (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={font.fallback.join(', ')}
                                        onChange={(e) => updateFallback(id, e.target.value.split(',').map(f => f.trim()))}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        placeholder="Arial, Helvetica, sans-serif"
                                    />
                                </div>

                                {/* Font Sources */}
                                <div>
                                    <h5 className="text-sm font-medium mb-3">Font Weights & Formats</h5>

                                    {/* Existing Sources */}
                                    <div className="space-y-3 mb-4">
                                        {font.sources?.map((source, index) => (
                                            <div key={index} className="bg-gray-800 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-sm font-medium">
                                                            {WEIGHT_OPTIONS.find(w => w.value === source.weight)?.label || source.weight}
                                                        </span>
                                                        <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                                                            {source.style}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFontSource(id, index)}
                                                        className="p-1 text-gray-400 hover:text-red-400"
                                                        title="Remove weight"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    {/* WOFF2 Upload */}
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">WOFF2</label>
                                                        {source.woff2 ? (
                                                            <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                                                                <div className="flex items-center space-x-1">
                                                                    <Check size={12} className="text-emerald-500" />
                                                                    <span className="text-xs truncate max-w-[80px]">Uploaded</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        const input = document.createElement('input');
                                                                        input.type = 'file';
                                                                        input.accept = '.woff2';
                                                                        input.onchange = (e) => {
                                                                            const file = (e.target as HTMLInputElement).files?.[0];
                                                                            if (file) handleFontFileUpload(file, id, source.weight, source.style, 'woff2');
                                                                        };
                                                                        input.click();
                                                                    }}
                                                                    className="text-xs text-blue-400 hover:text-blue-300"
                                                                    disabled={!!uploadingFontId}
                                                                >
                                                                    Replace
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    const input = document.createElement('input');
                                                                    input.type = 'file';
                                                                    input.accept = '.woff2';
                                                                    input.onchange = (e) => {
                                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                                        if (file) handleFontFileUpload(file, id, source.weight, source.style, 'woff2');
                                                                    };
                                                                    input.click();
                                                                }}
                                                                disabled={isUploading(id, source.weight, source.style)}
                                                                className="w-full px-2 py-2 bg-gray-700 text-xs rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center space-x-1"
                                                            >
                                                                {isUploading(id, source.weight, source.style) ? (
                                                                    <>
                                                                        <Loader size={12} className="animate-spin" />
                                                                        <span>Uploading...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload size={12} />
                                                                        <span>Upload</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* WOFF Upload */}
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">WOFF</label>
                                                        {source.woff ? (
                                                            <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                                                                <div className="flex items-center space-x-1">
                                                                    <Check size={12} className="text-emerald-500" />
                                                                    <span className="text-xs truncate max-w-[80px]">Uploaded</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        const input = document.createElement('input');
                                                                        input.type = 'file';
                                                                        input.accept = '.woff';
                                                                        input.onchange = (e) => {
                                                                            const file = (e.target as HTMLInputElement).files?.[0];
                                                                            if (file) handleFontFileUpload(file, id, source.weight, source.style, 'woff');
                                                                        };
                                                                        input.click();
                                                                    }}
                                                                    className="text-xs text-blue-400 hover:text-blue-300"
                                                                    disabled={!!uploadingFontId}
                                                                >
                                                                    Replace
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    const input = document.createElement('input');
                                                                    input.type = 'file';
                                                                    input.accept = '.woff';
                                                                    input.onchange = (e) => {
                                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                                        if (file) handleFontFileUpload(file, id, source.weight, source.style, 'woff');
                                                                    };
                                                                    input.click();
                                                                }}
                                                                disabled={isUploading(id, source.weight, source.style)}
                                                                className="w-full px-2 py-2 bg-gray-700 text-xs rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center space-x-1"
                                                            >
                                                                {isUploading(id, source.weight, source.style) ? (
                                                                    <>
                                                                        <Loader size={12} className="animate-spin" />
                                                                        <span>Uploading...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload size={12} />
                                                                        <span>Upload</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* TTF Upload */}
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">TTF</label>
                                                        {source.ttf ? (
                                                            <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                                                                <div className="flex items-center space-x-1">
                                                                    <Check size={12} className="text-emerald-500" />
                                                                    <span className="text-xs truncate max-w-[80px]">Uploaded</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        const input = document.createElement('input');
                                                                        input.type = 'file';
                                                                        input.accept = '.ttf';
                                                                        input.onchange = (e) => {
                                                                            const file = (e.target as HTMLInputElement).files?.[0];
                                                                            if (file) handleFontFileUpload(file, id, source.weight, source.style, 'ttf');
                                                                        };
                                                                        input.click();
                                                                    }}
                                                                    className="text-xs text-blue-400 hover:text-blue-300"
                                                                    disabled={!!uploadingFontId}
                                                                >
                                                                    Replace
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    const input = document.createElement('input');
                                                                    input.type = 'file';
                                                                    input.accept = '.ttf';
                                                                    input.onchange = (e) => {
                                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                                        if (file) handleFontFileUpload(file, id, source.weight, source.style, 'ttf');
                                                                    };
                                                                    input.click();
                                                                }}
                                                                disabled={isUploading(id, source.weight, source.style)}
                                                                className="w-full px-2 py-2 bg-gray-700 text-xs rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center space-x-1"
                                                            >
                                                                {isUploading(id, source.weight, source.style) ? (
                                                                    <>
                                                                        <Loader size={12} className="animate-spin" />
                                                                        <span>Uploading...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload size={12} />
                                                                        <span>Upload</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Upload Progress */}
                                                {isUploading(id, source.weight, source.style) && (
                                                    <div className="mt-2">
                                                        <div className="w-full bg-gray-700 rounded-full h-1">
                                                            <div
                                                                className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
                                                                style={{ width: `${uploadProgress}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-400 text-center mt-1">
                                                            Uploading... {uploadProgress}%
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Source */}
                                    {(!font.sources || font.sources.length < WEIGHT_OPTIONS.length * STYLE_OPTIONS.length) && (
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h6 className="text-sm font-medium mb-3">Add Font Weight</h6>
                                            <div className="flex items-end space-x-3">
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Weight</label>
                                                    <select
                                                        value={newSource.weight}
                                                        onChange={(e) => setNewSource({ ...newSource, weight: parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
                                                    >
                                                        {WEIGHT_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Style</label>
                                                    <select
                                                        value={newSource.style}
                                                        onChange={(e) => setNewSource({ ...newSource, style: e.target.value as 'normal' | 'italic' })}
                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
                                                    >
                                                        {STYLE_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => addFontSource(id)}
                                                    className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {Object.keys(fontFamilies).length === 0 && (
                    <div className="text-center py-12 bg-gray-700/30 rounded-lg">
                        <Type size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">No custom fonts added yet</p>
                        <p className="text-sm text-gray-500 mt-1">Click "Add Font Family" to get started</p>
                    </div>
                )}
            </div>

            {/* Add Font Modal */}
            {showAddFontModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Add Font Family</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={newFontData.label}
                                    onChange={(e) => setNewFontData({ ...newFontData, label: e.target.value })}
                                    placeholder="e.g., Open Sans"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Font Family Name
                                </label>
                                <input
                                    type="text"
                                    value={newFontData.family}
                                    onChange={(e) => setNewFontData({ ...newFontData, family: e.target.value })}
                                    placeholder="e.g., 'Open Sans', OpenSans"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This is the font-family name used in CSS
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Fallback Fonts (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={newFontData.fallback?.join(', ')}
                                    onChange={(e) => setNewFontData({
                                        ...newFontData,
                                        fallback: e.target.value.split(',').map(f => f.trim())
                                    })}
                                    placeholder="Arial, Helvetica, sans-serif"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                            </div>

                            <div className="bg-blue-500/10 p-3 rounded-lg">
                                <p className="text-xs text-blue-400 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    After creating the font family, you can add weights and upload WOFF2/WOFF/TTF files.
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setShowAddFontModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addFontFamily}
                                    className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600"
                                >
                                    Create Font Family
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}