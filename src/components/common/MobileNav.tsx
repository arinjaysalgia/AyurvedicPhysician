import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  navLinks: NavLink[];
  currentPath: string;
}

export default function MobileNav({ navLinks, currentPath }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-earth-800 hover:text-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 rounded-md"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        id="mobile-menu"
        role="navigation"
        className={`absolute top-16 left-0 right-0 bg-cream border-b border-earth-100 shadow-lg transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ul className="px-6 py-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  currentPath === href || (href !== '/' && currentPath.startsWith(href))
                    ? 'text-forest-500 bg-forest-50'
                    : 'text-earth-800 hover:text-forest-500 hover:bg-forest-50'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 bg-gold-600 text-white font-semibold rounded-lg hover:bg-gold-500 transition-colors duration-300"
            >
              Book Consultation
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
