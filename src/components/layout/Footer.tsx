import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiTwitter, FiGithub, FiMail, FiGlobe } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Explore', href: '/explore' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Create', href: '/create' },
        { name: 'Marketplace', href: '/marketplace' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Tutorials', href: '/tutorials' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and Social Links */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Lumen Tales Logo" width={40} height={40} />
              <span className="text-xl font-bold">Lumen Tales</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              A tokenized interactive narrative platform where stories become digital assets.
            </p>
            <div className="flex mt-6 space-x-4">
              <a
                href="https://x.com/LumenTales"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/LumenTale"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@lumentales.com"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <FiMail className="w-5 h-5" />
              </a>
              <a
                href="https://www.lumentales.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Website"
              >
                <FiGlobe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold tracking-wider uppercase">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 mt-8 border-t border-gray-800">
          <p className="text-sm text-center text-gray-400">
            &copy; {currentYear} Lumen Tales. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 