import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpSchema } from '../shared/schemas';
import { formatZodErrors } from '../validation/zodHelpers';
import { TextField } from '../components/forms/TextField';
import { Button } from '../components/common/Button';
import { useStore } from '../hooks/useStore';

export const Signup: React.FC = observer(() => {
  const { auth } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    try {
      SignUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors = formatZodErrors(error);
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      await auth.signup(formData.name, formData.email, formData.password);
      navigate('/notes');
    } catch (error) {
      // Error is handled in the store
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Start organizing your thoughts today
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
              placeholder="Enter your full name"
              required
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
              placeholder="Create a password (min. 8 characters)"
              helper="Password must be at least 8 characters long"
              required
            />

            <Button
              type="submit"
              loading={auth.isLoading}
              disabled={auth.isLoading}
              className="w-full"
            >
              Create account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});