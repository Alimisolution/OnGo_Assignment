import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ongo-navy text-white border-t border-white/10">
      {/* Contact Banner */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-ongo-navy-light border border-ongo-blue-accent/30 rounded-lg p-6 text-center">
          <p className="text-lg mb-2">
            Questions before you enroll? Reach our team
          </p>
          <p className="text-lg">
            at{' '}
            <a 
              href="mailto:team@insureongo.com" 
              className="text-ongo-blue-accent hover:underline font-semibold"
            >
              team@insureongo.com
            </a>
            {' '}- we're already fully operational.
          </p>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 border-t border-white/10">
        <div className="text-center space-y-3 text-sm text-gray-400">
          <p>
            © 2026 InsureOnGo.com Partnering Insurtech Limited · RC 8030897
          </p>
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <MapPin className="w-4 h-4" />
            343 Borno Way, By Hughes Avenue, Alagomeji, Yaba, Lagos, Nigeria
          </p>
          <p className="flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+2348188350000" className="hover:text-white transition">+234 818 835 0000</a>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+2347047386000" className="hover:text-white transition">+234 704 738 6000</a>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:team@insureongo.com" className="hover:text-white transition">team@insureongo.com</a>
            </span>
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <a href="#" className="hover:text-white transition underline">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition underline">Terms of Reference</a>
          </div>
        </div>
      </div>
    </footer>
  );
};