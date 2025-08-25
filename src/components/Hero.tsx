import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, MapPin, Mail, Phone, Download } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';
import profileImage from '@/assets/profile-avatar.jpg';
import { usePersonalInfo } from '@/hooks/usePortfolioData';

// This environment cannot access your local files, so these import statements
// will cause a compilation error. They are commented out for this preview.
// You should uncomment these lines and ensure the paths are correct in your
// local project for the images to display properly.
// import heroImage from '@/assets/hero-bg.jpg';
// import profileImage from '@/assets/profile-avatar.jpg';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  

  const personalInfo = {
    location: 'Bangladesh',
    name: 'AL Amin Hossain Porbot',
    title: 'ICT Trainer & Technology Specialist',
    bio: 'A motivated, creative, and responsible ICT professional with ENFP personality. Passionate about empowering others through technology education and delivering innovative solutions in computer training and technical support.',
    cvFileUrl: 'https://drive.google.com/file/d/1SNNwRPboCqomhP-X3Oerq249TaMh2iji/view?usp=sharing',
    email: 'alaminhossainporbot.bd@gmail.com',
    phone: '+8801880233082',
  };
  
  const isLoading = false;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCV = () => {
    if (personalInfo?.cvFileUrl) {
      window.open(personalInfo.cvFileUrl, '_blank');
    }
  };

  return (
    <section 
      className="section-hero relative min-h-screen flex items-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Gradient Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex items-center py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
          
          {/* Text Content */}
          <div className={`space-y-6 lg:space-y-8 text-center lg:text-left ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="space-y-4">
              <Badge variant="secondary" className="px-3 py-2 text-xs sm:text-sm font-medium border border-white/20">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                ICT Professional • {personalInfo?.location || 'Bangladesh'}
              </Badge>
              
              <h1 className="text-white leading-tight font-extrabold tracking-tight">
                <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-white/90 mb-2">
                  Hello, I'm
                </span>
                <span className="text-gradient-accent text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  {personalInfo?.name || 'AL Amin Hossain Porbot'}
                </span>
              </h1>
              
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium">
                {personalInfo?.title || 'ICT Trainer & Technology Specialist'}
              </h2>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {personalInfo?.bio || 'A motivated, creative, and responsible ICT professional with ENFP personality. Passionate about empowering others through technology education and delivering innovative solutions in computer training and technical support.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                className="
                  group min-h-[48px] text-base font-semibold px-6 py-3
                  bg-gradient-to-br from-primary to-accent text-white
                  hover:from-accent hover:to-primary hover:scale-105 transition-all
                  shadow-lg hover:shadow-2xl hover:shadow-accent/40
                " 
                onClick={handleDownloadCV}
                disabled={!personalInfo?.cvFileUrl}
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                {isLoading ? 'Loading...' : 'View CV'}
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white min-h-[48px] text-base font-semibold px-6 py-3"
                onClick={scrollToNext}
              >
                Learn More
              </Button>
            </div>

            {/* Quick Contact */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 border-t border-white/20 justify-center lg:justify-start">
              <a 
                href={`mailto:${personalInfo?.email || 'alaminhossainporbot.bd@gmail.com'}`}
                className="flex items-center justify-center lg:justify-start text-white/80 hover:text-accent transition-colors min-h-[44px] px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">{personalInfo?.email || 'alaminhossainporbot.bd@gmail.com'}</span>
              </a>
              <a 
                href={`tel:${personalInfo?.phone || '+8801880233082'}`}
                className="flex items-center justify-center lg:justify-start text-white/80 hover:text-accent transition-colors min-h-[44px] px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">{personalInfo?.phone || '+8801880233082'}</span>
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className={`flex justify-center lg:justify-end order-first lg:order-last ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-glow">
                <img 
                  src={profileImage}
                  alt={personalInfo?.name || "AL Amin Hossain Porbot"}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badges - hidden on small screens */}
              <div className="hidden sm:block absolute -top-4 -right-4 bg-accent text-accent-foreground px-3 py-1 lg:px-4 lg:py-2 rounded-lg font-semibold shadow-lg animate-float text-xs lg:text-sm">
                ICT Expert
              </div>
              <div className="hidden sm:block absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-3 py-1 lg:px-4 lg:py-2 rounded-lg font-semibold shadow-lg animate-float text-xs lg:text-sm" style={{ animationDelay: '1s' }}>
                Trainer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={scrollToNext}
          className="text-white/60 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
