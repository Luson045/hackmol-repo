// client/src/components/layout/Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Use NavLink for active styling
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef(null); // Ref for detecting clicks outside

    // Close mobile menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const linkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out";
    const activeLinkClasses = "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
    const mobileLinkClasses = "block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out";
    const mobileActiveLinkClasses = "block bg-gray-900 text-white px-3 py-2 rounded-md text-base font-medium";

    const getNavLinkClass = ({ isActive }) => isActive ? activeLinkClasses : linkClasses;
    const getMobileNavLinkClass = ({ isActive }) => isActive ? mobileActiveLinkClasses : mobileLinkClasses;

    // --- Links for Authenticated Users (Desktop) ---
    const authLinks = (
        <>
            <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
            <NavLink to="/marketplace" className={getNavLinkClass}>Marketplace</NavLink>
            {/* --- Added Chat Link Here --- */}
            <NavLink to="/chat" className={getNavLinkClass}>Chat</NavLink>
            {/* --- End Added Chat Link --- */}
            {user && user.role === 'admin' && (
                <NavLink to="/admin" className={getNavLinkClass}>Admin</NavLink>
            )}
            <button
                onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false); // Close menu on logout
                }}
                className={`${linkClasses} bg-transparent border-none cursor-pointer w-full md:w-auto text-left`} // Ensure button looks like link
            >
                Logout
            </button>
        </>
    );

    // --- Links for Guest Users (Desktop) ---
    const guestLinks = (
        <>
            <NavLink to="/login" className={getNavLinkClass}>Login / Register</NavLink>
        </>
    );

    // --- Links for Authenticated Users (Mobile) ---
    const mobileAuthLinks = (
        <>
            <NavLink to="/dashboard" className={getMobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
            <NavLink to="/marketplace" className={getMobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Marketplace</NavLink>
            {/* --- Added Chat Link Here --- */}
            <NavLink to="/chat" className={getMobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Chat</NavLink>
            {/* --- End Added Chat Link --- */}
            {user && user.role === 'admin' && (
                <NavLink to="/admin" className={getMobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Admin</NavLink>
            )}
            <button
                onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false); // Close menu on logout
                }}
                className={`${mobileLinkClasses} bg-transparent border-none cursor-pointer w-full text-left`}
            >
                Logout
            </button>
        </>
    );

    // --- Links for Guest Users (Mobile) ---
    const mobileGuestLinks = (
        <>
            <NavLink to="/login" className={getMobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Login / Register</NavLink>
        </>
    );


    return (
      <>
        <nav ref={navRef} className="bg-gray-800 fixed top-0 left-0 right-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-white text-xl font-bold hover:text-gray-300">
                            Token Marketplace
                        </Link>
                    </div>

                    {/* Desktop Menu Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {isAuthenticated ? authLinks : guestLinks}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            type="button"
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon when menu is closed (Hamburger) */}
                            <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            {/* Icon when menu is open (Close) */}
                            <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu, show/hide based on menu state. */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-gray-800 bg-opacity-95 backdrop-blur-sm pb-3`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {isAuthenticated ? mobileAuthLinks : mobileGuestLinks}
                </div>
            </div>
        </nav>
        <br/><br/>
        </>
    );
};

export default Navbar;