import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

type LoginFormCtx = z.infer<typeof loginSchema>;

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormCtx>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormCtx) => {
        try {
            const { isSignedIn, nextStep } = await signIn({ username: data.email, password: data.password });
            if (isSignedIn) {
                navigate('/');
            } else {
                // Handle MFA or other steps if needed
                console.log('Next step:', nextStep);
            }
        } catch (err: any) {
            console.error('Login error', err);
            setError(err?.message || "Failed to login");
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-coffee-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <labelAndPassword htmlFor="email" className="block text-sm font-medium leading-6 text-coffee-900">
                            Email address
                        </labelAndPassword>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register('email')}
                                className="block w-full rounded-md border-0 py-1.5 text-coffee-900 shadow-sm ring-1 ring-inset ring-coffee-300 placeholder:text-coffee-400 focus:ring-2 focus:ring-inset focus:ring-coffee-600 sm:text-sm sm:leading-6"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <labelAndPassword htmlFor="password" className="block text-sm font-medium leading-6 text-coffee-900">
                                Password
                            </labelAndPassword>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-coffee-600 hover:text-coffee-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...register('password')}
                                className="block w-full rounded-md border-0 py-1.5 text-coffee-900 shadow-sm ring-1 ring-inset ring-coffee-300 placeholder:text-coffee-400 focus:ring-2 focus:ring-inset focus:ring-coffee-600 sm:text-sm sm:leading-6"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full justify-center rounded-md bg-coffee-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-coffee-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee-600 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <a href="#" className="font-semibold leading-6 text-coffee-600 hover:text-coffee-500">
                        Start a 14 day free trial
                    </a>
                </p>
            </div>
        </div>
    );
}

function labelAndPassword({ children, htmlFor, className }: any) {
    return <label htmlFor={htmlFor} className={className}>{children}</label>
}
