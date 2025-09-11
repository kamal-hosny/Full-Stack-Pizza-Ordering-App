import { Routes } from '@/constants/enums';
import MainHeading from '../main-heading';
import Image from 'next/image';

async function About() {
  return (
    <section className="section-gap py-16" id={Routes.ABOUT}>
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <MainHeading subTitle="Our Delicious Journey" title="About PizzaShop" />
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
              <p className="text-2xl font-bold">10+</p>
              <p>Years of Experience</p>
            </div>
          </div>

          <div>
            <div className="bg-primary/10 p-6 rounded-xl mb-8">
              <p className="text-gray-700 italic">
                &ldquo;We believe pizza is not just food, it&apos;s an experience. Every slice tells a story of tradition, passion, and quality.&rdquo;
              </p>
            </div>

            <div className="space-y-6 text-gray-700">
              <p>
                Founded in 2013, PizzaShop began as a small family-owned pizzeria with a simple mission: to create the most delicious pizzas using authentic recipes and the freshest ingredients. Our secret? A 100-year-old dough recipe passed down through generations.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>Handmade Dough</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>Fresh Ingredients</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>Wood-Fired Oven</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>Family Recipes</span>
                </div>
              </div>

              <p>
                Today, we continue that tradition while innovating with new flavors. Our chefs travel Italy yearly to discover new techniques and ingredients, ensuring every pizza we serve is a masterpiece of flavor and craftsmanship.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors">
                Meet Our Chefs
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary/10 font-bold py-3 px-6 rounded-full transition-colors">
                View Our Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;