// components/Navbar.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex fixed top-0 z-50 w-[100vw] justify-between items-center py-2 px-8 md:px-8 bg-black/50 border-b-2 border-[#333b4d99] backdrop-blur-lg text-white">
      {/* Logo */}
      <div className="text-xl md:text-2xl font-bold text-[#4ca6ff]">
        Freelance Marketplace
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center">
        <Link
          to="/how-it-works"
          className="text-gray-300 hover:text-white transition-colors duration-200"
        >
          How it Works
        </Link>
        <Link
          to="#pricing"
          className="text-gray-300 hover:text-white transition-colors duration-200"
        >
          Pricing
        </Link>
        <Link
          to="/login"
          className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Register
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-white hover:text-gray-300 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 md:hidden">
          <div className="flex flex-col py-4 px-4 space-y-4">
            <Link
              to="/how-it-works"
              className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              to="/pricing"
              className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
