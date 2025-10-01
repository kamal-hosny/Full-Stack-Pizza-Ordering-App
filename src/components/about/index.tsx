import { Routes } from '@/constants/enums';
import MainHeading from '../main-heading';
import Image from 'next/image';
import getTrans from '@/lib/translation';
import { getCurrentLocale } from '@/lib/getCurrentLocale';

async function About() {
  const locale = await getCurrentLocale();
  const t = await getTrans(locale);
  return (
    <section className="section-gap py-16" id={Routes.ABOUT}>
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <MainHeading subTitle={t.home.about.ourStory} title={t.home.about.aboutUs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://img.freepik.com/free-photo/slice-crispy-pizza-with-meat-cheese_140725-6974.jpg?semt=ais_hybrid&w=740"
                alt="Delicious pizza with fresh ingredients"
                width={500}
                height={500}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-xl shadow-lg">
              <p className="text-2xl font-bold">{t.home.about.badge.count}</p>
              <p>{t.home.about.badge.years}</p>
            </div>
          </div>

          <div>
            <div className="bg-primary/10 p-6 rounded-xl mb-8">
              <p className="text-gray-700 italic">
                {t.home.about.descriptions.one}
              </p>
            </div>

            <div className="space-y-6 text-gray-700">
              <p>
                {t.home.about.descriptions.two}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>{t.home.about.features.f1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>{t.home.about.features.f2}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>{t.home.about.features.f3}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>{t.home.about.features.f4}</span>
                </div>
              </div>

              <p>
                {t.home.about.descriptions.three}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors">
                {t.home.about.buttons.meetOurChefs}
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary/10 font-bold py-3 px-6 rounded-full transition-colors">
                {t.home.about.buttons.viewOurMenu}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;