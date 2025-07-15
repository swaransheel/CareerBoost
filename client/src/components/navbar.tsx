import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-slate-900 cursor-pointer">CareerBoost</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium transition-colors ${
              location === "/" ? "text-primary" : "text-slate-700 hover:text-primary"
            }`}>
              Jobs
            </Link>
            <Link href="/applications" className={`font-medium transition-colors ${
              location === "/applications" ? "text-primary" : "text-slate-700 hover:text-primary"
            }`}>
              My Applications
            </Link>
            <Link href="/admin/applications" className={`font-medium transition-colors ${
              location === "/admin/applications" ? "text-primary" : "text-slate-700 hover:text-primary"
            }`}>
              Admin
            </Link>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Sign In
            </button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="block px-3 py-2 text-slate-700 hover:text-primary transition-colors font-medium">
              Jobs
            </Link>
            <Link href="/applications" className="block px-3 py-2 text-slate-700 hover:text-primary transition-colors font-medium">
              My Applications
            </Link>
            <Link href="/admin/applications" className="block px-3 py-2 text-slate-700 hover:text-primary transition-colors font-medium">
              Admin
            </Link>
            <button className="w-full mt-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
