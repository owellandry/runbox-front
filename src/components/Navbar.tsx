import React from 'react';
import { Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const Navbar: React.FC = () => {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-anthropic-dark/60 border border-anthropic-light-gray/10 rounded-full w-full max-w-4xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto">
        <Link to="/" className="flex items-center gap-2 text-lg font-poppins font-medium tracking-tight text-anthropic-light hover:opacity-80 transition-opacity">
          <Box className="w-5 h-5 text-anthropic-orange" />
          <span>Runboxjs</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-poppins font-medium text-anthropic-light-gray">
          <Link to="/docs" className="hover:text-anthropic-light transition-colors">Documentación</Link>
          <Link to="/demo" className="hover:text-anthropic-light transition-colors">Demo</Link>
          <a href="https://github.com/owellandry/runbox-front" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-anthropic-light transition-colors bg-anthropic-light/5 hover:bg-anthropic-light/10 px-4 py-2 rounded-full border border-anthropic-light-gray/5">
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;