import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Shield, Command } from 'lucide-react';

const Register = () => {
  const { register: registerAction, loading, error, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    clearAuthError();
    const result = await registerAction(data);
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4 relative overflow-hidden">
      <div className="w-full max-w-xl glass-panel p-8 rounded-2xl border border-zinc-800 shadow-xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-sm mb-4">
            <Command className="w-6 h-6 text-zinc-100" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">Create Workspace</h2>
          <p className="text-xs text-zinc-500 mt-1.5 uppercase font-semibold tracking-wider">Register a tenant and start calling candidates with AI</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/20 border border-red-900/30 flex items-center gap-2.5 text-red-400 text-xs font-semibold uppercase">
            <Shield className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              type="text"
              placeholder="Acme Corp"
              error={errors.companyName}
              {...register('companyName', { required: 'Company name is required' })}
            />

            <Input
              label="Industry"
              type="text"
              placeholder="Technology"
              error={errors.industry}
              {...register('industry')}
            />

            <Input
              label="Administrator Name"
              type="text"
              placeholder="Alex Admin"
              error={errors.name}
              {...register('name', { required: 'Admin name is required' })}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+919876543210"
              error={errors.phone}
              {...register('phone')}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="admin@company.com"
            error={errors.email}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          <Button type="submit" loading={loading} className="w-full py-3 mt-2">
            Create tenant & register
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6 font-semibold uppercase tracking-wider">
          Already registered?{' '}
          <Link to="/login" className="text-zinc-300 hover:text-zinc-100 font-bold transition-colors underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
