import { Heart, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center cursor-pointer space-x-2"
            onClick={() => onNavigate('home')}
          >
            <Heart className="h-8 w-8 text-emerald-600" fill="currentColor" />
            <span className="text-2xl font-bold text-gray-900">Hope Bridge</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              Explore Projects
            </button>
            {user && profile?.role === 'project_creator' && (
              <button
                onClick={() => onNavigate('create')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'create' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Create Project
              </button>
            )}
            {user && profile?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'admin' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Admin Panel
              </button>
            )}
            {user && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'dashboard' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{profile?.full_name || 'User'}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-sm text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('signin')}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-emerald-600"
            >
              Explore Projects
            </button>
            {user && profile?.role === 'project_creator' && (
              <button
                onClick={() => {
                  onNavigate('create');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-medium text-gray-700 hover:text-emerald-600"
              >
                Create Project
              </button>
            )}
            {user && profile?.role === 'admin' && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-medium text-gray-700 hover:text-emerald-600"
              >
                Admin Panel
              </button>
            )}
            {user && (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-medium text-gray-700 hover:text-emerald-600"
              >
                Dashboard
              </button>
            )}
            <div className="border-t pt-3 mt-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{profile?.full_name || 'User'}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 text-sm text-gray-700 hover:text-emerald-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onNavigate('signin');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm font-medium text-gray-700 hover:text-emerald-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
