const Footer = () => {
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
              Crafting delicious pizzas with love since 2010. Our authentic recipes and fresh ingredients make every bite unforgettable.
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
            <h3 className='text-lg font-bold mb-4 border-b border-primary pb-2'>Quick Links</h3>
            <ul className='space-y-2'>
              {['Menu', 'Special Offers', 'Locations', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className='text-gray-300 hover:text-primary transition-colors'>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className='text-lg font-bold mb-4 border-b border-primary pb-2'>Contact Us</h3>
            <ul className='space-y-3 text-gray-300'>
              <li className='flex items-start gap-3'>
                <span>📍</span> 123 Pizza Street, Food City
              </li>
              <li className='flex items-center gap-3'>
                <span>📞</span> +2012121212
              </li>
              <li className='flex items-center gap-3'>
                <span>✉️</span> info@pizzashop.com
              </li>
              <li className='flex items-center gap-3'>
                <span>🕒</span> 10AM - 11PM Daily
              </li>
            </ul>
          </div>
        </div>
        
        <div className='border-t border-gray-800 mt-10 pt-6 text-center text-gray-400'>
          <p>© {new Date().getFullYear()} PizzaShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;