import React, { useEffect, useState } from 'react';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import LoginModal from './LoginModal';
import { User as UserType} from '../types';
import { logout } from '../utils/api';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const { getTotalItems } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  useEffect(() => {
    if(!localStorage.getItem("user")) {
      setUser(null);
      return;
    }
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [localStorage.getItem("user")]);

  const handleAuthAction = async () => {
    if (user) {
      await logout();
      window.location.reload();
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PickPerfect</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onPageChange('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'home'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onPageChange('products')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'products'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                All Products
              </button>
              {user && (<button
                onClick={() => onPageChange('personalize')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'personalize'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Just For You
              </button>)}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">

              {/* Cart */}
              <button
                onClick={() => onPageChange('cart')}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                {user && (
                  <span className="text-sm text-gray-700 hidden sm:block">
                    Hello, {user.username}
                  </span>
                )}
                <button
                  onClick={handleAuthAction}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {user ? <LogOut className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  <span className="hidden sm:block">{user ? 'Logout' : 'Login'}</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    onPageChange('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'home'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    onPageChange('products');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'products'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  All Products
                </button>
                {/* Mobile Search */}
                <div className="px-3 pt-2">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="bg-transparent outline-none text-sm w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Navbar;