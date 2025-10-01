import Hero from "./_components/Hero";
import BestSellers from "./_components/BestSellers";
import About from "@/components/about";
import Contact from "@/components/contact";
import getTrans from "@/lib/translation";
import { Locale } from "@/i18n.config";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) { 
  const { locale } = await params;
  const t = await getTrans(locale);

  return (
    <main>
      <Hero 
        title={t.home.hero.title}
        description={t.home.hero.description}
        orderNow={t.home.hero.orderNow}
        learnMore={t.home.hero.learnMore}
        featureDelivery={t.home.hero.features?.delivery || "30 Min Delivery"}
        featureNatural={t.home.hero.features?.natural || "100% Natural Ingredients"}
      />
      <BestSellers 
        subTitle={t.home.bestSeller.checkOut}
        title={t.home.bestSeller.OurBestSellers}
        menuTranslations={t.menuItem}
      />
      <About 
        subTitle={t.home.about.ourStory}
        title={t.home.about.aboutUs}
        descOne={t.home.about.descriptions.one}
        descTwo={t.home.about.descriptions.two}
        descThree={t.home.about.descriptions.three}
        badgeCount={t.home.about.badge?.count || "10+"}
        badgeLabel={t.home.about.badge?.years || "Years of Experience"}
        meetOurChefs={t.home.about.buttons?.meetOurChefs || "Meet Our Chefs"}
        viewOurMenu={t.home.about.buttons?.viewOurMenu || "View Our Menu"}
        f1={t.home.about.features?.f1 || "Handmade Dough"}
        f2={t.home.about.features?.f2 || "Fresh Ingredients"}
        f3={t.home.about.features?.f3 || "Wood-Fired Oven"}
        f4={t.home.about.features?.f4 || "Family Recipes"}
      />
      <Contact 
        subTitle={t.home.contact["Don'tHesitate"]}
        title={t.home.contact.contactUs}
        formTitle={t.home.contact.form?.title || "Send us a message"}
        namePlaceholder={t.home.contact.form?.name || "Your Name"}
        emailPlaceholder={t.home.contact.form?.email || "Your Email"}
        messagePlaceholder={t.home.contact.form?.message || "Your Message"}
        submitText={t.home.contact.form?.submit || "Send Message"}
        locationLabel={t.home.contact.location?.label || "Our Location"}
        address={t.home.contact.location?.address || "123 Pizza Street, Food City"}
        phoneLabel={t.home.contact.phone?.label || "Phone Number"}
        phoneNote={t.home.contact.phone?.note || "Call us for delivery orders"}
        emailLabel={t.home.contact.email?.label || "Email Us"}
        openingHoursLabel={t.home.contact.openingHours?.label || "Opening Hours"}
        openingHoursValue={t.home.contact.openingHours?.value || "Monday-Sunday: 10AM - 11PM"}
      />
    </main>
  );
}
