import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import Gallery from '@/components/sections/Gallery';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import React from 'react';

const page = () => {
  return (
    <div className="">
      <Hero />
      <About />
      {/* v1 */}
      <div className='h-screen'></div>
      <Gallery />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default page;