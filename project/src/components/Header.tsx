import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, LogOut, LayoutDashboard, ClipboardList, BarChart2, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login';
  const isAuthenticated = ['/student-dashboard', '/teacher-dashboard'].includes(location.pathname);
  const isTeacher = location.pathname === '/teacher-dashboard';

  const handleLogout = () => {
    navigate('/login');
  };

  const getNavLinks = () => {
    if (isTeacher) {
      return [
        { to: '/teacher-dashboard', icon: <LayoutDashboard className="h-5 w-5" />, text: 'Dashboard' },
        { to: '/create-test', icon: <Plus className="h-5 w-5" />, text: 'Create Test' },
        { to: '/results', icon: <BarChart2 className="h-5 w-5" />, text: 'Results' },
      ];
    }
    return [
      { to: '/student-dashboard', icon: <LayoutDashboard className="h-5 w-5" />, text: 'Dashboard' },
      { to: '/tests', icon: <ClipboardList className="h-5 w-5" />, text: 'Tests' },
      { to: '/results', icon: <BarChart2 className="h-5 w-5" />, text: 'Results' },
    ];
  };

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">srm lab</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isLoginPage && !isAuthenticated && (
              <>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </Link>
              </>
            )}
            {isAuthenticated && (
              <>
                {getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
            {isLoginPage && (
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <span>Back to Home</span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!isLoginPage && !isAuthenticated && (
              <>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Contact Us
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </Link>
              </>
            )}
            {isAuthenticated && (
              <>
                {getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
            {isLoginPage && (
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Back to Home
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};