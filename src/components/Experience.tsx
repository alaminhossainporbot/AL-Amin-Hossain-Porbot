import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CalendarDays, MapPin, Building, CheckCircle } from 'lucide-react';

const Experience = () => {
  const responsibilities = [
    "Delivered comprehensive ICT training to students of various skill levels",
    "Developed and implemented hands-on curriculum for computer assembly and maintenance",
    "Provided expert guidance on networking concepts and practical implementations", 
    "Conducted troubleshooting workshops and real-world problem-solving sessions",
    "Mentored students in professional development and industry best practices",
    "Maintained and updated training equipment and laboratory infrastructure",
    "Collaborated with faculty to enhance course content and delivery methods",
    "Assessed student progress and provided constructive feedback for improvement"
  ];

  const achievements = [
    "Successfully trained 200+ students in ICT fundamentals",
    "Maintained 95% student satisfaction rate",
    "Developed innovative hands-on training modules",
    "Established modern computer lab infrastructure"
  ];

  return (
    <section id="experience" className="section-standard bg-gradient-subtle">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Professional Experience
        </Badge>
        <h2 className="text-gradient mb-6">
          Career Journey & Impact
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Currently serving as an ICT Trainer, where I combine technical expertise with 
          educational excellence to shape the next generation of technology professionals.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="card-glow">
          <div className="space-y-8">
            {/* Position Header */}
            <div className="border-b border-border pb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    ICT Trainer
                  </h3>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">FEMOTOTECH COMPUTER TRAINING INSTITUTE</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    May 1, 2023 - Current
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    Full-time Position
                  </Badge>
                </div>
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-foreground flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-accent" />
                Key Responsibilities
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                {responsibilities.map((responsibility, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0 group-hover:bg-primary transition-colors" />
                    <p className="text-muted-foreground leading-relaxed">
                      {responsibility}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Achievements */}
            <div className="space-y-6 pt-6 border-t border-border">
              <h4 className="text-xl font-semibold text-foreground flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-accent" />
                Key Achievements
              </h4>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <Card 
                    key={index}
                    className="p-4 bg-accent/5 border-accent/20 hover:bg-accent/10 transition-colors"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {achievement}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Technologies & Tools */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h4 className="text-lg font-semibold text-foreground">
                Technologies & Tools Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Computer Hardware",
                  "Network Equipment", 
                  "Mikrotik RouterOS",
                  "Cisco Systems",
                  "Windows Server",
                  "Linux Systems",
                  "Virtualization",
                  "Remote Support Tools",
                  "Educational Software",
                  "Lab Management"
                ].map((tech, index) => (
                  <Badge 
                    key={tech}
                    variant="outline" 
                    className="px-2 py-1 hover:bg-primary/10 transition-colors"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Experience;