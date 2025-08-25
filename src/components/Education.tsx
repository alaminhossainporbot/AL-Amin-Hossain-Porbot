import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GraduationCap, Award, FileCheck, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const Education = () => {
  // State to manage the visibility of the dialog and the selected certification data
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Data for academic qualifications
  const academicQualifications = [
    {
      degree: "Higher Secondary Certificate (H.S.C)",
      level: "Grade 12",
      description: "Completed higher secondary education with focus on science and technology",
      icon: GraduationCap,
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      degree: "Secondary School Certificate (S.S.C)",
      level: "Grade 10",
      description: "Foundation education with strong academic performance",
      icon: BookOpen,
      color: "bg-green-500/10 text-green-600"
    }
  ];

  // Data for professional certifications, including more details and new `outcomes` field for the pop-up
  const professionalCertifications = [
    {
      title: "IT Support Service Level 5",
      issuer: "National Skills Development Authority",
      description: "Advanced level certification in IT support services and technical management",
      level: "Expert Level",
      icon: Award,
      color: "bg-purple-500/10 text-purple-600",
      details: "This certification covers advanced topics like IT service management, technical leadership, and complex system troubleshooting. It validates a high level of expertise required for senior roles.",
      outcomes: [
        "IT Service Management & Best Practices",
        "Complex System Troubleshooting",
        "Technical Leadership & Mentoring",
        "Strategic Planning for IT Operations",
        "Problem Solving & Root Cause Analysis"
      ]
    },
    {
      title: "IT Support Service Level 4",
      issuer: "National Skills Development Authority",
      description: "Professional level certification in IT support and system administration",
      level: "Professional Level",
      icon: FileCheck,
      color: "bg-orange-500/10 text-orange-600",
      details: "This professional certification focuses on practical skills in system administration, network configuration, and security protocols. It demonstrates the ability to manage and maintain IT infrastructure efficiently.",
      outcomes: [
        "Windows & Linux Server Administration",
        "Network Configuration (Routers & Switches)",
        "IT Security & Data Protection",
        "System Backup & Recovery",
        "Active Directory & User Management"
      ]
    },
    {
      title: "IT Support Service Level 3",
      issuer: "National Skills Development Authority",
      description: "Intermediate level certification in computer support and maintenance",
      level: "Intermediate Level",
      icon: FileCheck,
      color: "bg-cyan-500/10 text-cyan-600",
      details: "An intermediate certification that provides foundational knowledge in computer hardware, software troubleshooting, and user support. It's a key step in building a career in IT support.",
      outcomes: [
        "Hardware Installation & Maintenance",
        "Software Troubleshooting & Diagnosis",
        "Operating System Installation & Configuration",
        "Help Desk Support & Ticketing Systems"
      ]
    },
    {
      title: "CBT&A Level 4",
      issuer: "Competency Based Training & Assessment",
      description: "Advanced competency-based certification in training and assessment",
      level: "Advanced Level",
      icon: Award,
      color: "bg-red-500/10 text-red-600",
      details: "This certification validates expertise in designing, developing, and delivering competency-based training programs. It focuses on assessing learner performance and ensuring the quality of training materials.",
      outcomes: [
        "Curriculum Design & Development",
        "Adult Learning Principles",
        "Competency Assessment Methods",
        "Training Delivery & Facilitation",
        "Quality Assurance in Education"
      ]
    }
  ];

  // Function to handle card click, opens the dialog with selected data
  const handleCardClick = (certification) => {
    setSelectedCertification(certification);
    setIsDialogOpen(true);
  };

  return (
    <section id="education" className="py-16 px-4 sm:px-8 lg:px-16 section-standard">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Education & Certifications
        </Badge>
        <h2 className="text-gradient mb-6 text-3xl sm:text-4xl">
          Academic Foundation & Professional Growth
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
          A solid educational background complemented by industry-recognized certifications
          that validate expertise in IT support services and training methodologies.
        </p>
      </div>

      {/* Academic Qualifications */}
      <div className="mb-16">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-8 text-center">
          Academic Qualifications
        </h3>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {academicQualifications.map((qualification, index) => (
            <Card
              key={qualification.degree}
              className="card-premium group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${qualification.color} flex items-center justify-center flex-shrink-0`}>
                    <qualification.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-1">
                      {qualification.degree}
                    </h4>
                    <Badge variant="secondary" className="mb-3">
                      {qualification.level}
                    </Badge>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {qualification.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Professional Certifications */}
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-8 text-center">
          Professional Certifications
        </h3>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {professionalCertifications.map((certification, index) => (
            <Card
              key={certification.title}
              className="card-glow group cursor-pointer"
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={() => handleCardClick(certification)}
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className={`w-14 h-14 rounded-xl ${certification.color} flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0`}>
                    <certification.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start mb-2">
                      <h4 className="text-lg font-semibold text-foreground leading-tight">
                        {certification.title}
                      </h4>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {certification.level}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-accent mb-2">
                      {certification.issuer}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {certification.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Skills Summary */}
      <div className="mt-16 text-center">
        <Card className="card-premium max-w-4xl mx-auto">
          <div className="space-y-6 p-4 sm:p-6">
            <h4 className="text-xl font-semibold text-foreground">
              Certification Skills Summary
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-3">
                <h5 className="font-medium text-foreground">Technical Support</h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Hardware Troubleshooting</li>
                  <li>• Software Installation</li>
                  <li>• System Optimization</li>
                  <li>• Remote Support</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className="font-medium text-foreground">Network Management</h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Network Configuration</li>
                  <li>• Security Implementation</li>
                  <li>• Performance Monitoring</li>
                  <li>• Infrastructure Setup</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className="font-medium text-foreground">Training & Assessment</h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Curriculum Development</li>
                  <li>• Student Assessment</li>
                  <li>• Practical Training</li>
                  <li>• Quality Assurance</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* The Dialog (pop-up) component without the close button */}
      {selectedCertification && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md w-11/12 p-6 rounded-lg">
            <DialogHeader>
              <DialogTitle>{selectedCertification.title}</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {selectedCertification.issuer}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {/* Main details section */}
              <div>
                <p className="text-foreground text-sm sm:text-base">
                  <span className="font-semibold">Level:</span> {selectedCertification.level}
                </p>
                <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                  <span className="font-semibold text-foreground">Description:</span> {selectedCertification.details}
                </p>
              </div>

              {/* New section for Learning Outcomes */}
              {selectedCertification.outcomes && selectedCertification.outcomes.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">
                    Key Learning Outcomes
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {selectedCertification.outcomes.map((outcome, index) => (
                      <li key={index} className="text-sm">{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default Education;
