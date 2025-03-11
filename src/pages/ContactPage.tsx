import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TeamSection from '../components/home/TeamSection';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">{t('contact.title')}</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <Mail className="w-8 h-8 text-[#6A0DAD] mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('contact.email')}</h3>
              <a href="mailto:contact@avolta.be" className="text-gray-600 hover:text-[#6A0DAD]">
                contact@avolta.be
              </a>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <Phone className="w-8 h-8 text-[#6A0DAD] mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('contact.phone')}</h3>
              <a href="tel:+32123456789" className="text-gray-600 hover:text-[#6A0DAD]">
                +32 123 456 789
              </a>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
              <MapPin className="w-8 h-8 text-[#6A0DAD] mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('contact.address')}</h3>
              <address className="text-gray-600 text-center not-italic">
                Brussels Airport<br />
                1930 Zaventem<br />
                Belgium
              </address>
            </div>
          </div>
        </div>

        <TeamSection />
      </div>
    </div>
  );
}