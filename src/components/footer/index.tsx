import getTrans from '@/lib/translation';
import { getCurrentLocale } from '@/lib/getCurrentLocale';
import Link from '@/components/link';
import { Routes } from '@/constants/enums';

const Footer = async () => {
  const locale = await getCurrentLocale();
  const t = await getTrans(locale);

  const quickLinks: { label?: string; href: string }[] = [
    { label: t.footer?.quickLinks?.items?.menu, href: `/${locale}/${Routes.MENU}` },
    { label: t.footer?.quickLinks?.items?.specialOffers, href: `/${locale}/${Routes.MENU}` },
    { label: t.footer?.quickLinks?.items?.locations, href: `/${locale}/${Routes.CONTACT}` },
    { label: t.footer?.quickLinks?.items?.aboutUs, href: `/${locale}/${Routes.ABOUT}` },
    { label: t.footer?.quickLinks?.items?.contact, href: `/${locale}/${Routes.CONTACT}` },
  ];

  return (
    <footer className='bg-gray-900 text-white py-12'>
      <div className='container'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-2'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='bg-primary w-8 h-8 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold'>P</span>
              </div>
              <span className='text-xl font-bold text-primary'>Pizza<span className='text-secondary'>Shop</span></span>
            </div>
            <p className='text-gray-300 mb-4'>
              {t.footer?.description}
            </p>
            <div className='flex gap-4'>
              {[/* Social icons would go here */].map((icon, idx) => (
                <a key={idx} href="#" className='bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors'>
                  {icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className='text-lg font-bold mb-4 border-b border-primary pb-2'>{t.footer?.quickLinks?.title}</h3>
            <ul className='space-y-2'>
              {quickLinks.map(({ label, href }, idx) => (
                <li key={`${href}-${label || idx}`}>
                  <Link href={href} className='text-gray-300 hover:text-primary transition-colors'>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className='text-lg font-bold mb-4 border-b border-primary pb-2'>{t.footer?.contact?.title}</h3>
            <ul className='space-y-3 text-gray-300'>
              <li className='flex items-start gap-3'>
                <span>📍</span> {t.home?.contact?.location?.address || t.footer?.contact?.address}
              </li>
              <li className='flex items-center gap-3'>
                <span>📞</span> {t.footer?.contact?.phone}
              </li>
              <li className='flex items-center gap-3'>
                <span>✉️</span> {t.footer?.contact?.email}
              </li>
              <li className='flex items-center gap-3'>
                <span>🕒</span> {t.footer?.contact?.hours || t.home?.contact?.openingHours?.value}
              </li>
            </ul>
          </div>
        </div>
        
        <div className='border-t border-gray-800 mt-10 pt-6 text-center text-gray-400'>
          <p>{(t.footer?.copyright || '').replace('{year}', String(new Date().getFullYear()))}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;