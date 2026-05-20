import React, { useState } from 'react';
import { Building2, Eye, EyeOff, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const { login, signup } = useAuth();

  React.useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    const { data } = await supabase.from('companies').select('id, name');
    if (data) {
      setCompanies(data);
      if (data.length > 0) setSelectedCompanyId(data[0].id);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        setError('Por favor ingrese email y contrasena');
        return;
      }

      if (isSignup) {
        if (!name.trim()) {
          setError('Por favor ingrese su nombre');
          return;
        }
        const result = await signup(email, password, name, selectedCompanyId);
        if (!result.success) {
          setError(result.error || 'Error al registrarse');
        }
      } else {
        const success = await login(email, password);
        if (!success) {
          setError('Credenciales incorrectas. Verifique su email y contrasena.');
        }
      }
    } catch {
      setError('Error al iniciar sesion. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Flotas</h1>
          <p className="text-gray-600">
            {isSignup ? 'Crea tu cuenta para comenzar' : 'Ingrese sus credenciales para continuar'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Juan Perez"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="correo@empresa.com"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contrasena
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Ingrese su contrasena"
                  required
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <select
                  id="company"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignup ? 'Registrando...' : 'Ingresando...'}
                </div>
              ) : (
                <div className="flex items-center">
                  {isSignup ? <UserPlus size={18} className="mr-2" /> : <LogIn size={18} className="mr-2" />}
                  {isSignup ? 'Registrarse' : 'Iniciar Sesion'}
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {isSignup ? 'Ya tengo cuenta - Iniciar Sesion' : 'No tengo cuenta - Registrarse'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
