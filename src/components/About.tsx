import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Heart, Brain, Users, Zap } from 'lucide-react';

const About = () => {
  const personalityTraits = [
    {
      icon: Heart,
      title: "Motivated",
      description: "Driven by passion for technology and continuous learning"
    },
    {
      icon: Brain,
      title: "Creative",
      description: "Innovative problem-solver with fresh perspectives"
    },
    {
      icon: Users,
      title: "Responsible",
      description: "Committed to delivering quality results and reliability"
    },
    {
      icon: Zap,
      title: "ENFP",
      description: "Enthusiastic, people-focused, and inspiration-driven"
    }
  ];

  return (
    <section id="about" className="section-standard bg-gradient-subtle">
      <div className="text-center mb-12 lg:mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2 text-sm">
          About Me
        </Badge>
        <h2 className="text-gradient mb-4 lg:mb-6">
          Passionate About Technology & Education
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          As an ICT Trainer at FEMOTOTECH COMPUTER TRAINING INSTITUTE, I combine technical expertise 
          with a passion for education to empower the next generation of technology professionals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Story */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
              My Journey in Technology
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              My journey in the ICT field began with a curiosity about how technology can transform lives. 
              With formal qualifications in H.S.C and S.S.C, coupled with professional certifications in 
              IT Support Services, I've built a comprehensive foundation in technology education.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Currently serving as an ICT Trainer since May 2023, I specialize in computer assembly, 
              network configuration, and comprehensive technical support. My approach combines theoretical 
              knowledge with practical, hands-on experience to ensure students gain real-world skills.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-semibold text-foreground">Core Values</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">Continuous learning and professional development</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">Student-centered teaching methodology</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">Innovation in educational technology</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">Building strong professional relationships</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Personality Traits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {personalityTraits.map((trait, index) => (
            <Card 
              key={trait.title} 
              className="card-mobile group hover:border-accent/50 touch-manipulation active:scale-95"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <trait.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2">{trait.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{trait.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;