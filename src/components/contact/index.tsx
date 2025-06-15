import MainHeading from '@/components/main-heading';
import { Routes } from '@/constants/enums';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <section className='section-gap py-16 bg-gray-50' id={Routes.CONTACT}>
      <div className='container'>
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <MainHeading
            subTitle={`Don't hesitate to reach out`}
            title={"Get in Touch"}
          />
          <p className='text-gray-600 mt-4'>
            Have questions about our menu or want to place a special order? Our team is ready to assist you!
          </p>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='bg-white p-8 rounded-xl shadow-lg'>
            <div className='flex flex-col gap-6'>
              <div className='flex items-start gap-4'>
                <div className='bg-primary/10 p-3 rounded-full'>
                  <MapPin className='text-primary w-6 h-6' />
                </div>
                <div>
                  <h3 className='font-bold text-lg mb-1'>Our Location</h3>
                  <p className='text-gray-600'>123 Pizza Street, Food City</p>
                </div>
              </div>
              
              <div className='flex items-start gap-4'>
                <div className='bg-primary/10 p-3 rounded-full'>
                  <Phone className='text-primary w-6 h-6' />
                </div>
                <div>
                  <h3 className='font-bold text-lg mb-1'>Phone Number</h3>
                  <a className='text-2xl font-bold text-primary hover:text-primary-dark transition-colors' href='tel:+2012121212'>
                    +2012121212
                  </a>
                  <p className='text-gray-600 mt-1'>Call us for delivery orders</p>
                </div>
              </div>
              
              <div className='flex items-start gap-4'>
                <div className='bg-primary/10 p-3 rounded-full'>
                  <Mail className='text-primary w-6 h-6' />
                </div>
                <div>
                  <h3 className='font-bold text-lg mb-1'>Email Us</h3>
                  <a href="mailto:info@pizzashop.com" className='text-primary hover:text-primary-dark transition-colors'>
                    info@pizzashop.com
                  </a>
                </div>
              </div>
              
              <div className='flex items-start gap-4'>
                <div className='bg-primary/10 p-3 rounded-full'>
                  <Clock className='text-primary w-6 h-6' />
                </div>
                <div>
                  <h3 className='font-bold text-lg mb-1'>Opening Hours</h3>
                  <p className='text-gray-600'>Monday-Sunday: 10AM - 11PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className='bg-white p-8 rounded-xl shadow-lg'>
            <h3 className='text-xl font-bold mb-6'>Send us a message</h3>
            <form className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className='p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className='p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
              <textarea 
                placeholder="Your Message" 
                rows={4}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
              ></textarea>
              <button 
                type="submit"
                className='bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors'
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;