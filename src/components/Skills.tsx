import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  Network, 
  Wrench, 
  Shield, 
  Server, 
  Settings,
  FileText,
  Cloud,
  Cpu,
  HardDrive
} from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: "Office Applications",
      icon: FileText,
      color: "bg-blue-500/10 text-blue-600",
      skills: [
        { name: "Google Suite", level: 95, icon: Cloud },
        { name: "Microsoft Office", level: 90, icon: FileText },
        { name: "Document Management", level: 85, icon: FileText },
        { name: "Presentation Design", level: 80, icon: Monitor }
      ]
    },
    {
      title: "Networking",
      icon: Network,
      color: "bg-green-500/10 text-green-600",
      skills: [
        { name: "Network Setup", level: 85, icon: Network },
        { name: "Firewall Configuration", level: 80, icon: Shield },
        { name: "Switch Management", level: 85, icon: Settings },
        { name: "Router Setup", level: 90, icon: Server },
        { name: "Mikrotik/Cisco", level: 75, icon: Settings }
      ]
    },
    {
      title: "Technical Skills",
      icon: Wrench,
      color: "bg-purple-500/10 text-purple-600",
      skills: [
        { name: "Computer Assembly", level: 95, icon: Cpu },
        { name: "Hardware Maintenance", level: 90, icon: HardDrive },
        { name: "System Troubleshooting", level: 85, icon: Wrench },
        { name: "Performance Optimization", level: 80, icon: Settings }
      ]
    }
  ];

  return (
    <section id="skills" className="section-standard">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Technical Skills
        </Badge>
        <h2 className="text-gradient mb-6">
          Expertise & Capabilities
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive technical skills spanning office applications, networking infrastructure, 
          and hardware management developed through hands-on experience and continuous learning.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {skillCategories.map((category, categoryIndex) => (
          <Card 
            key={category.title} 
            className="card-glow group"
            style={{ animationDelay: `${categoryIndex * 0.2}s` }}
          >
            <div className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {category.title}
                  </h3>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skill.name}
                    className="space-y-2"
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <skill.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress 
                      value={skill.level} 
                      className="h-2 bg-muted"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Skills Summary */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-wrap gap-3 justify-center max-w-4xl">
          {[
            "System Administration",
            "Technical Training",
            "Hardware Diagnostics",
            "Network Security",
            "IT Support",
            "Computer Repair",
            "Software Installation",
            "Data Recovery",
            "Remote Support",
            "Customer Service"
          ].map((skill, index) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className="px-3 py-1 hover:bg-accent/20 transition-colors cursor-default"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;