import React from 'react';
import { Mic, Github, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  t: any;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-gray-950 border-t border-gray-900">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Mic className="h-6 w-6 text-purple-400 mr-2" />
              <span className="text-white font-bold text-xl">VoiceCart</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-purple-400 transition-colors">
                  {t.features}
                </a>
              </li>
              <li>
                <a href="#why" className="text-gray-400 hover:text-purple-400 transition-colors">
                  {t.ourWhy}
                </a>
              </li>
              <li>
                <a href="#demo" className="text-gray-400 hover:text-purple-400 transition-colors">
                  {t.demo}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.contact.title}</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <a href="mailto:sehanaf4@gmail.com" className="hover:text-purple-400 transition-colors">
                  sehanaf4@gmail.com
                </a>
              </li>
              <li className="text-gray-400">
                <a href="tel:+6285718020396" className="hover:text-purple-400 transition-colors">
                  +62 857 1802 0396
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-900 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            {t.footer.copyright}
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
              {t.footer.privacyPolicy}
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
              {t.footer.termsOfService}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;