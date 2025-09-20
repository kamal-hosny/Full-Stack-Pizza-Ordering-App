"use client";
import MainHeading from '@/components/main-heading';
import { Routes } from '@/constants/enums';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name" 
                    className={`p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email" 
                    className={`p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message" 
                  rows={4}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors w-full ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;