import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import P2l from '../../assets/P2L.webp'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast';
import { Logout } from '../../api/auth';
import {
    canManageQuizzes,
    canManageUsers,
    getAuthStorageEventName,
    getStoredUser,
} from '../../api/userManagment';


const Navbar = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(getStoredUser());
    const user = userData?.user || null;
    const showQuizManagement = canManageQuizzes();
    const showUserManagement = canManageUsers();
    const [isLoggedIn, setIsLoggedIn] = useState(!!userData);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const logout = async () => {
        setLoading(true);
        try {
            await Logout();
            setIsLoggedIn(false);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || "Logout failed");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        const syncAuthState = () => {
            const nextUserData = getStoredUser();
            setUserData(nextUserData);
            setIsLoggedIn(!!nextUserData);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('storage', syncAuthState);
        window.addEventListener(getAuthStorageEventName(), syncAuthState);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('storage', syncAuthState);
            window.removeEventListener(getAuthStorageEventName(), syncAuthState);
        };
    }, []);

    return (
        <nav className="bg-white shadow-md px-6 " style={{ position: 'relative', zIndex: 100 }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-600">
                    <img className="w-20" src={P2l} alt="The platform logo" />
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Home</Link>
                    <Link to="/Plans" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Plans</Link>
                    <Link to="/library" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Library</Link>
                    <Link to="/join-quiz" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Join Quiz</Link>
                    {showQuizManagement && (
                        <Link to="/create-quiz" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Create Quiz</Link>
                    )}
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Login</Link>
                            <Link to="/auth/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium">Register</Link>
                        </>
                    ) : (
                        <div className="relative z-999" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition duration-300 focus:outline-none"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="hidden lg:block">{user?.full_name || user?.email || 'User'}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 " style={{ zIndex: 200 }} >
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-900">{user?.full_name || user?.first_name || 'User'}</p>
                                        <p className="text-xs text-gray-500">{user?.email || ''}</p>
                                    </div>
                                    <Link to="/private/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                                        My Profile
                                    </Link>
                                    <Link to="/private/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                                        Settings
                                    </Link>
                                    {showQuizManagement ? (
                                        <Link to="/private/my-quizzes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                                            My Quizzes
                                        </Link>
                                    ) : (
                                        <Link to="/private/quiz-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                                            My Quiz History
                                        </Link>
                                    )}
                                    {showUserManagement && (
                                        <Link to="/private/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <div>
                                        <Button
                                            onClick={logout}
                                            variant="danger"
                                            textContent="Logout"
                                            loading={loading}
                                            disabled={loading}
                                            className="w-full text-left text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col space-y-4">
                        <Link to="/Plans" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Plans</Link>
                        <Link to="/library" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Library</Link>
                        <Link to="/join-quiz" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Join Quiz</Link>
                        {showQuizManagement && (
                            <Link to="/create-quiz" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Create Quiz</Link>
                        )}

                        <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                            {!isLoggedIn ? (
                                <>
                                    <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Login</Link>
                                    <Link to="/auth/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium text-center">Register</Link>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-3 px-2 py-2 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{user?.full_name || 'User'}</p>
                                            <p className="text-xs text-gray-500">{user?.email || ''}</p>
                                        </div>
                                    </div>
                                    <Link to="/private/profile" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 pl-2">
                                        My Profile
                                    </Link>
                                    <Link to="/private/settings" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 pl-2">
                                        Settings
                                    </Link>
                                    {showQuizManagement ? (
                                        <Link to="/private/my-quizzes" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 pl-2">
                                            My Quizzes
                                        </Link>
                                    ) : (
                                        <Link to="/private/quiz-history" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 pl-2">
                                            My Quiz History
                                        </Link>
                                    )}
                                    {showUserManagement && (
                                        <Link to="/private/admin" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 pl-2">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Button
                                        onClick={logout}
                                        variant='primary'
                                        textContent="Logout"
                                        loading={loading}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

