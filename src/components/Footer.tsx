import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  Heart,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Me', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact', href: '#contact' }
  ];

  const services = [
    'ICT Training',
    'Technical Consulting',
    'Network Setup',
    'IT Support',
    'Computer Assembly',
    'System Troubleshooting'
  ];

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

            {/* Brand & Contact */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {/* 'AP' টেক্সট সরিয়ে এখানে ছবি যোগ করা হয়েছে */}
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src="favicon.ico"
                      alt="AL Amin Hossain Porbot Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AL Amin Hossain Porbot</h3>
                    <p className="text-primary-foreground/70 text-sm">ICT Trainer & Technology Specialist</p>
                  </div>
                </div>

                <p className="text-primary-foreground/80 leading-relaxed">
                  Empowering the next generation through technology education and innovative ICT solutions.
                </p>
              </div>

              <div className="space-y-3">
                <a href="mailto:alaminhossainporbot.bd@gmail.com" className="flex items-center text-primary-foreground/80 hover:text-accent transition-colors">
                  <Mail className="w-4 h-4 mr-3" />
                  alaminhossainporbot.bd@gmail.com
                </a>
                <a href="tel:+8801880233082" className="flex items-center text-primary-foreground/80 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4 mr-3" />
                  +8801880233082
                </a>
                <div className="flex items-center text-primary-foreground/80">
                  <MapPin className="w-4 h-4 mr-3" />
                  Bangladesh
                </div>
              </div>
            </div>

            {/* Services (Now in second position) */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Services</h4>
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center text-primary-foreground/80 text-sm"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links (Now in third position) */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              {/* This line was updated to reduce spacing */}
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter & Social */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Stay Connected</h4>

              <div className="space-y-4">
                <p className="text-primary-foreground/80 text-sm">
                  Follow me on social media for the latest updates and tech insights.
                </p>

                <div className="flex space-x-3">
                  <a
                    href="https://www.linkedin.com/in/alaminhossainporbot/"
                    className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit my LinkedIn profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/alaminhossainporbot"
                    className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit my GitHub profile"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/PorbotAl"
                    className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit my Twitter profile"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                  Available for Projects
                </Badge>
                <p className="text-primary-foreground/70 text-xs">
                  Currently accepting new training opportunities and consulting projects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-primary-foreground/70">
                <span>© {currentYear} AL Amin Hossain Porbot. All rights reserved.</span>
                <span className="hidden md:block">•</span>
                <div className="flex items-center">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 mx-1 text-accent" />
                  <span>for Evolution.org</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="text-primary-foreground/70 hover:text-accent hover:bg-accent/10"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
