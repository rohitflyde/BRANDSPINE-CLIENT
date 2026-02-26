// src/sections/Identity/AssetUpload.tsx
import { useState, useRef } from "react";
import { Upload, X, Link as LinkIcon, Image, Loader } from "lucide-react";
import { useBrandStore } from "../../store/brandStore";
import api from "../../services/api";

interface AssetUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void; // This is the updateDraft function
  accept?: string;
  description?: string;
  folder?: string; // Optional folder in ImageKit
  path: (string | number)[]; // Add path prop for the updateDraft
}

export default function AssetUpload({
  label,
  value,
  onChange,
  accept = "image/*",
  description,
  folder = "brands",
  path
}: AssetUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateDraft } = useBrandStore();

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Get the token
      const token = localStorage.getItem('token');

      // Upload to backend (which will upload to ImageKit)
      const response = await api.post('/upload',formData);

      clearInterval(progressInterval);

      if (!response.data) {
        const errorData = response.data
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = response.data;
      setUploadProgress(100);
      
      // Wait a moment to show 100% progress
      setTimeout(() => {
        // Update the brand config with the new image URL
        onChange(data.url); // This calls updateDraft with the path and URL
        
        // Also directly update the draft to ensure it's saved
        updateDraft(path, data.url);
        
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlValue) {
      onChange(urlValue);
      updateDraft(path, urlValue); // Also directly update
      setShowUrlInput(false);
      setUrlValue("");
    }
  };

  const handleRemove = () => {
    onChange("");
    updateDraft(path, ""); // Also directly update
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>

      {value ? (
        // Preview mode
        <div className="relative group">
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
              }}
            />
          </div>

          {/* ImageKit optimization badge */}
          {value.includes('ik.imagekit.io') && (
            <div className="absolute top-2 left-2 bg-blue-600 text-xs text-white px-2 py-1 rounded-full">
              ImageKit CDN
            </div>
          )}

          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => window.open(value, '_blank')}
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
              title="View full size"
            >
              <Image size={16} />
            </button>
            <button
              onClick={() => setShowUrlInput(true)}
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
              title="Change URL"
            >
              <LinkIcon size={16} />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
              title="Remove"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        // Upload mode
        <div
          className={`
            border-2 border-dashed rounded-lg p-6
            transition-colors cursor-pointer relative
            ${isDragging
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-gray-700 hover:border-gray-600'
            }
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <div className="text-center">
            {isUploading ? (
              <>
                <div className="relative mb-4">
                  <Loader size={32} className="mx-auto mb-2 animate-spin text-emerald-500" />
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Uploading to ImageKit CDN... {uploadProgress}%
                </p>
              </>
            ) : (
              <>
                <Upload size={32} className="mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-400">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {accept === "image/*" ? "PNG, JPG, SVG up to 5MB" : "SVG, GIF up to 5MB"}
                </p>
                <p className="text-xs text-emerald-500 mt-2">
                  ✨ Images are optimized and served via ImageKit CDN
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL Input Modal */}
      {showUrlInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Enter Image URL</h3>

            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
              autoFocus
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlValue("");
                }}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUrlSubmit}
                disabled={!urlValue}
                className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600 disabled:opacity-50"
              >
                Set URL
              </button>
            </div>
          </div>
        </div>
      )}

      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}