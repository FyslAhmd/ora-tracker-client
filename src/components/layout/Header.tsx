import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUser,
  HiOutlineBars3,
} from "react-icons/hi2";
import { useAuth, useAppDispatch } from "@/hooks";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Badge from "../ui/Badge";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "primary";
      case "inspector":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-none border-x-0 border-t-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side - Menu button + Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors flex-shrink-0"
          >
            <HiOutlineBars3 className="w-6 h-6" />
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
          </div>

          {title && (
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {/* Settings - Hide on mobile */}
          <button className="hidden sm:block p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors">
            <HiOutlineCog6Tooth className="w-5 h-5" />
          </button>

          {/* User Info with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 sm:gap-3 sm:pl-3 md:pl-4 sm:border-l border-dark-700 hover:opacity-80 transition-opacity cursor-pointer"
            >
              {/* Hide text on mobile, show only avatar */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white truncate max-w-[100px] md:max-w-none">
                  {user?.name}
                </p>
                <Badge
                  variant={getRoleBadgeVariant(user?.role || "")}
                  size="sm"
                >
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-dark-600">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        // Navigate to profile if needed
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                    >
                      <HiOutlineUser className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 transition-colors"
                    >
                      <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
