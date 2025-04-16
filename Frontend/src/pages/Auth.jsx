import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginUser, signupUser } from '../api/auth';
import toast from 'react-hot-toast';
import { queryClient } from '../main'

const Auth = () => {

  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 👈 this gives you "login" or "signup"

  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth'] }); // 🔁 refetch user
      toast.success('Logged in successfully!');
      navigate('/chat');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Login failed');
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Signed up successfully!');
      navigate('/chat');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Signup failed');
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mode==='login' ? loginMutation.mutate(formData) : signupMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode==='login' ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            disabled={loginMutation.isPending || signupMutation.isPending}
          >
            {mode==='login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          {mode==='login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => mode==='login' ? navigate('/auth/?mode=signup') : navigate('/auth/?mode=login')} className="text-indigo-600 font-medium hover:underline">
            {mode==='login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;