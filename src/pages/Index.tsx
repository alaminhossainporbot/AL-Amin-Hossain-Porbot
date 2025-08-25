import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Portfolio from '@/components/Portfolio';
import Certificates from '@/components/Certificates';
import Blog from '@/components/Blog';
import Hobbies from '@/components/Hobbies';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import MobileFloatingNav from '@/components/MobileFloatingNav';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <About />
        <Skills />
        <Experience />
        <Education />
        <Certificates />
        <Portfolio />
        <Blog />
        <Hobbies />
        <Contact />
      </main>
      <Footer />
      <MobileFloatingNav />
    </div>
  );
};

export default Index;
