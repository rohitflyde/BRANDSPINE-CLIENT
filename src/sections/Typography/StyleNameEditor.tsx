// src/sections/Typography/StyleNameEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface StyleNameEditorProps {
    styleKey: string;
    currentLabel: string;
    onSave: (newKey: string, newLabel: string) => void;
    onClose: () => void;
    existingKeys: string[];
}

export default function StyleNameEditor({
    styleKey,
    currentLabel,
    onSave,
    onClose,
    existingKeys
}: StyleNameEditorProps) {
    const [keyName, setKeyName] = useState(styleKey);
    const [labelName, setLabelName] = useState(currentLabel);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const validateKey = (key: string) => {
        // Check if key is valid (alphanumeric and underscores only)
        const validKeyRegex = /^[a-zA-Z0-9_]+$/;
        if (!validKeyRegex.test(key)) {
            return "Key can only contain letters, numbers, and underscores";
        }
        if (key !== styleKey && existingKeys.includes(key)) {
            return "A style with this key already exists";
        }
        return null;
    };

    const handleSave = () => {
        // Validate key
        const keyError = validateKey(keyName);
        if (keyError) {
            setError(keyError);
            return;
        }

        // Validate label
        if (!labelName.trim()) {
            setError("Label cannot be empty");
            return;
        }

        onSave(keyName, labelName);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Edit Style Name</h3>

                <div className="space-y-4">
                    {/* Object Key Field */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Object Key <span className="text-xs text-gray-500">(used in code)</span>
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={keyName}
                            onChange={(e) => {
                                setKeyName(e.target.value);
                                setError(null);
                            }}
                            onKeyDown={handleKeyPress}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., heading2, buttonLarge"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Only letters, numbers, and underscores allowed
                        </p>
                    </div>

                    {/* Display Label Field */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Display Label <span className="text-xs text-gray-500">(shown in UI)</span>
                        </label>
                        <input
                            type="text"
                            value={labelName}
                            onChange={(e) => {
                                setLabelName(e.target.value);
                                setError(null);
                            }}
                            onKeyDown={handleKeyPress}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Heading 2, Button Large"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Check size={16} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}