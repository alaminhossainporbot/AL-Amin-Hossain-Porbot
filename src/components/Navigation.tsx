import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, User, Code, Briefcase, GraduationCap, Heart, Mail, ChevronRight } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [{
    id: 'hero',
    label: 'Home',
    icon: Home
  }, {
    id: 'about',
    label: 'About',
    icon: User
  }, {
    id: 'skills',
    label: 'Skills',
    icon: Code
  }, {
    id: 'experience',
    label: 'Experience',
    icon: Briefcase
  }, {
    id: 'education',
    label: 'Education',
    icon: GraduationCap
  }, {
    id: 'certificates',
    label: 'Certificates',
    icon: GraduationCap
  }, {
    id: 'portfolio',
    label: 'Portfolio',
    icon: Briefcase
  }, {
    id: 'blog',
    label: 'Blog',
    icon: Heart
  }, {
    id: 'hobbies',
    label: 'Hobbies',
    icon: Heart
  }, {
    id: 'contact',
    label: 'Contact',
    icon: Mail
  }];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id === 'hero' ? 'hero' : item.id)
      }));
      const current = sections.find(section => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) {
        setActiveSection(current.id);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId === 'hero' ? 'hero' : sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-soft' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0 min-w-0">
              {/* This img tag uses the favicon.ico file from the public folder */}
              <img
                src="/favicon.ico"
                alt="Profile picture"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-bold text-sm sm:text-lg text-foreground truncate mx-0 px-[10px]">
                AL Amin Hossain Porbot
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map(item => <Button key={item.id} variant="ghost" size="sm" onClick={() => scrollToSection(item.id)} className={`px-4 py-2 transition-all duration-300 ${activeSection === item.id ? 'bg-accent/20 text-accent border-accent/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'}`}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>)}
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden p-2 hover:bg-accent/10 touch-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="fixed inset-0 z-40 lg:hidden animate-fade-in">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-14 sm:top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border shadow-medium">
            <div className="container mx-auto px-4 py-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="grid grid-cols-1 gap-1">
                {navItems.map((item, index) => <Button key={item.id} variant="ghost" onClick={() => scrollToSection(item.id)} className={`justify-between h-14 px-4 rounded-lg text-left group transition-all duration-200 ${activeSection === item.id ? 'bg-accent/20 text-accent border border-accent/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'}`} style={{
              animationDelay: `${index * 0.05}s`
            }}>
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-4" />
                    <span className="text-base font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>)}
              </div>
            </div>
          </div>
        </div>}

      {/* Floating Navigation Dots (Desktop) */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden xl:block">
        <div className="space-y-3">
          {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === item.id ? 'bg-accent scale-125' : 'bg-muted-foreground/30 hover:bg-accent/50'}`} title={item.label} />)}
        </div>
      </div>
    </>;
};

export default Navigation;
