import Contact from "@/components/contact";
import getTrans from "@/lib/translation";
import { Locale } from "@/i18n.config";

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTrans(locale);

  return (
    <main>
      <Contact
        subTitle={t.home.contact["Don'tHesitate"]}
        title={t.home.contact.contactUs}
        formTitle={t.home.contact.form?.title || "Send us a message"}
        namePlaceholder={t.home.contact.form?.name || "Your Name"}
        emailPlaceholder={t.home.contact.form?.email || "Your Email"}
        messagePlaceholder={t.home.contact.form?.message || "Your Message"}
        submitText={t.home.contact.form?.submit || "Send Message"}
        submittingText={t.home.contact.form?.submitting || "Sending..."}
        locationLabel={t.home.contact.location?.label || "Our Location"}
        address={t.home.contact.location?.address || "123 Pizza Street, Food City"}
        phoneLabel={t.home.contact.phone?.label || "Phone Number"}
        phoneNote={t.home.contact.phone?.note || "Call us for delivery orders"}
        emailLabel={t.home.contact.email?.label || "Email Us"}
        openingHoursLabel={t.home.contact.openingHours?.label || "Opening Hours"}
        openingHoursValue={t.home.contact.openingHours?.value || "Monday-Sunday: 10AM - 11PM"}
        nameRequired={t.home.contact.validation?.nameRequired || "Name is required"}
        nameMin={t.home.contact.validation?.nameMin || "Name must be at least 2 characters"}
        emailRequired={t.home.contact.validation?.emailRequired || "Email is required"}
        emailInvalid={t.home.contact.validation?.emailInvalid || "Please enter a valid email address"}
        messageRequired={t.home.contact.validation?.messageRequired || "Message is required"}
        messageMin={t.home.contact.validation?.messageMin || "Message must be at least 10 characters"}
        successTitle={t.home.contact.toasts?.successTitle || "Message sent successfully!"}
        successDescription={t.home.contact.toasts?.successDescription || "Thank you for contacting us. We'll get back to you soon."}
        errorTitle={t.home.contact.toasts?.errorTitle || "Error"}
        errorGeneric={t.home.contact.toasts?.errorGeneric || "Failed to send message. Please try again."}
      />
    </main>
  );
}
