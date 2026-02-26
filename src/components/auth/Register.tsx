// src/pages/auth/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    tenantName: z.string().min(2, 'Company name must be at least 2 characters'),
    tenantSlug: z
        .string()
        .min(3, 'Slug must be at least 3 characters')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const watchSlug = watch('tenantSlug');
    const slugPreview = watchSlug ? `your-site.com/${watchSlug}` : 'your-site.com/your-brand';

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            // This now matches your backend API structure
            await registerUser({
                email: data.email,
                password: data.password,
                tenantName: data.tenantName,
                tenantSlug: data.tenantSlug,
            });

            // Navigate to editor - AuthContext already stored token and user
            navigate('/editor');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start building your brand in minutes"
            alternativeLink={{
                text: "Already have an account?",
                linkText: 'Sign in',
                href: '/login',
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                )}

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Account Information</h3>

                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        helper="Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Company Information</h3>

                    <Input
                        label="Company Name"
                        placeholder="Acme Inc."
                        error={errors.tenantName?.message}
                        {...register('tenantName')}
                    />

                    <div>
                        <Input
                            label="Brand URL Slug"
                            placeholder="your-brand"
                            error={errors.tenantSlug?.message}
                            {...register('tenantSlug')}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Your brand will be available at: <span className="font-mono">{slugPreview}</span>
                        </p>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>🎉 Free trial:</strong> Get started with a 14-day free trial. No credit card required.
                    </p>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                >
                    Create Account
                </Button>

                <p className="text-xs text-gray-500 text-center">
                    By signing up, you agree to our{' '}
                    <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
            </form>
        </AuthLayout>
    );
};