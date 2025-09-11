'use client';

import { useState, useEffect } from 'react';
import UserProfile from './user-profile';
import NavMenu from './nav-menu';
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X } from 'lucide-react';

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Close sidebar with animation
    const closeSidebar = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 300);
    };

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isOpen && 
                !target.closest('.sidebar') && 
                !target.closest('.hamburger-btn') &&
                !target.closest('[data-radix-portal]') &&
                !target.closest('[data-radix-popper-content-wrapper]') &&
                !target.closest('.sidebar-interactive') &&
                !target.closest('[data-state]')) { 
                closeSidebar();
            }
        };

        if (isOpen && !isClosing) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen, isClosing]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md p-4">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                            <span className="text-background font-bold text-sm">P</span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground">
                            Posts App
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavMenu />
                        <div className="flex items-center gap-4">
                            <UserProfile />
                            <ModeToggle />
                        </div>
                    </div>

                    {/* Mobile Hamburger */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="hamburger-btn md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} className="text-muted-foreground" />
                    </button>
                </div>
            </nav>

                {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div 
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                            isClosing ? 'animate-fade-out' : 'animate-fade-in'
                        }`}
                        onClick={closeSidebar}
                    />
                    
                    {/* Sidebar */}
                    <div className={`sidebar fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl ${
                        isClosing ? 'animate-slide-out-to-right' : 'animate-slide-in-from-right'
                    }`}>
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                                    <span className="text-background font-bold text-sm">P</span>
                                </div>
                                <span className="font-semibold text-foreground">Menu</span>
                            </div>
                            <button 
                                onClick={closeSidebar}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>                        {/* Sidebar Content */}
                        <div className="flex flex-col h-full">
                            {/* Navigation Links */}
                            <div className="flex w-full p-6">
                                <div className="space-y-2 w-full">
                                    <NavMenu onItemClick={closeSidebar} />
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="border-t p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                                    <div onClick={(e) => e.stopPropagation()} className="sidebar-interactive">
                                        <ModeToggle />
                                    </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()} className="sidebar-interactive">
                                    <UserProfile />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}