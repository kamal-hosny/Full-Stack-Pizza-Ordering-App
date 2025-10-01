"use client";
import { buttonVariants } from "@/components/ui/button";
import { Routes } from "@/constants/enums";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const floatAnimation = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

const Hero = ({ title, description, orderNow, learnMore, featureDelivery, featureNatural }: { title: string; description: string; orderNow: string; learnMore: string; featureDelivery: string; featureNatural: string }) => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-white">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/10"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          className="py-8 md:py-12 relative z-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div className="mb-6" variants={item}>
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full font-medium text-sm">
              {learnMore}
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6"
            variants={item}
          >
            <span className="text-primary block">{title}</span>
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 my-6 max-w-lg text-lg"
            variants={item}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 mt-8"
            variants={container}
          >
            <motion.div variants={item}>
              <Link
                href={`/${Routes.MENU}`}
                className={`${buttonVariants({
                  size: "lg",
                })} space-x-2 !px-8 !py-5 !rounded-full font-bold shadow-md hover:shadow-lg transition-shadow duration-300 bg-primary hover:bg-primary-dark text-white flex items-center`}
              >
                {orderNow}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
            
            <motion.div variants={item}>
              <Link
                href={`/${Routes.ABOUT}`}
                className={`${buttonVariants({
                  variant: "outline",
                  size: "lg",
                })} space-x-2 !px-8 !py-5 !rounded-full font-bold border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300 flex items-center`}
              >
                {learnMore}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-12 flex flex-wrap gap-6"
            variants={container}
          >
            <motion.div 
              className="flex items-center gap-3"
              variants={item}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <span className="font-medium">{featureDelivery}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3"
              variants={item}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <span className="font-medium">{featureNatural}</span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative h-[400px] lg:h-[500px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div 
              className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px]"
              animate="float"
              variants={floatAnimation}
            >
              {/* Main Pizza Image - FIXED */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Image
                  src="https://img.freepik.com/premium-photo/isolated-pepperoni-pizza-with-salami_219193-8089.jpg" // Update with your image path
                  alt="Delicious Artisan Pizza"
                  fill
                  className="object-contain rounded-full"
                  priority
                  loading="eager"
                />
              </div>
              
              {/* Floating ingredients */}
              <motion.div 
                className="absolute top-8 left-2 w-12 h-12 rounded-full bg-red-500 shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              <motion.div 
                className="absolute bottom-16 right-6 w-10 h-10 rounded-full bg-green-600 shadow-lg"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              <motion.div 
                className="absolute top-20 right-14 w-8 h-8 rounded-full bg-yellow-400 shadow-lg"
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 8, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;