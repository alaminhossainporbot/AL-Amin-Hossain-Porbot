import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, User, Code, Briefcase, Mail, Plus, X } from 'lucide-react';

const MobileFloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'portfolio', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId === 'hero' ? 'hero' : sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* Floating action items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
          {navItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-end"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="mr-3 px-3 py-1 bg-background/90 text-foreground text-sm font-medium rounded-lg shadow-md backdrop-blur-sm">
                {item.label}
              </span>
              <Button
                size="icon"
                onClick={() => scrollToSection(item.id)}
                className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
              >
                <item.icon className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main floating button */}
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ${
          isOpen 
            ? 'bg-destructive hover:bg-destructive/90 rotate-45' 
            : 'bg-accent hover:bg-accent/90 text-accent-foreground'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default MobileFloatingNav;