// src/components/auth/AuthLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    alternativeLink?: {
        text: string;
        linkText: string;
        href: string;
    };
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    alternativeLink
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Brand Builder</h1>
                    <p className="text-gray-600 mt-2">Create and manage your brand identity</p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                        {subtitle && (
                            <p className="text-gray-600 mt-2">{subtitle}</p>
                        )}
                    </div>

                    {children}

                    {alternativeLink && (
                        <p className="text-center mt-6 text-sm text-gray-600">
                            {alternativeLink.text}{' '}
                            <Link
                                to={alternativeLink.href}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {alternativeLink.linkText}
                            </Link>
                        </p>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center mt-8 text-sm text-gray-600">
                    © 2024 Brand Builder. All rights reserved.
                </p>
            </div>
        </div>
    );
};