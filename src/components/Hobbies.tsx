import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Book,
  Code,
  Camera,
  Music,
  Gamepad2,
  Dumbbell,
  Plane,
  Users
} from 'lucide-react';

const Hobbies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState(null);

  const hobbies = [
    {
      icon: Book,
      title: "Reading",
      description: "Technology blogs, educational content, and personal development books",
      detailedDescription: "I have a deep passion for continuous learning, and reading is a cornerstone of that. I regularly dive into technology blogs like Wired and TechCrunch to stay on top of the latest trends. I also find great value in personal development books that help me grow as a professional and as a person.",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Code,
      title: "Coding",
      description: "Exploring new programming languages and building educational tools",
      detailedDescription: "Coding is more than a job for me; it's a creative outlet. I love exploring new languages and frameworks, constantly challenging myself to learn something new. I'm particularly interested in building educational tools and simple web applications that can help others learn more effectively.",
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Capturing moments and documenting training sessions",
      detailedDescription: "Photography allows me to see the world from a different perspective. I enjoy capturing beautiful landscapes and cityscapes, but my favorite moments to document are during my training sessions. It helps me preserve memories and share the learning experience with a wider audience.",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: Music,
      title: "Music",
      description: "Listening to various genres and exploring music technology",
      detailedDescription: "Music has always been a big part of my life. I enjoy listening to everything from classical to modern electronic music. I'm fascinated by the technology behind music production and have spent time exploring digital audio workstations and synthesizers.",
      color: "bg-red-500/10 text-red-600"
    },
    {
      icon: Gamepad2,
      title: "Gaming",
      description: "Strategy games and educational simulations for problem-solving",
      detailedDescription: "Gaming is a fantastic way to unwind and sharpen my mind. I'm a big fan of strategy games and educational simulations because they require critical thinking, planning, and problem-solving. It's a fun way to apply skills that are also crucial in my professional life.",
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      icon: Dumbbell,
      title: "Fitness",
      description: "Maintaining physical health and mental clarity through exercise",
      detailedDescription: "I believe that a healthy body is essential for a healthy mind. Regular exercise, whether it's a run in the morning or a quick workout, helps me stay energized and focused. It's my way of de-stressing and ensuring I can perform at my best.",
      color: "bg-cyan-500/10 text-cyan-600"
    },
    {
      icon: Plane,
      title: "Travel",
      description: "Exploring new places and learning about different cultures",
      detailedDescription: "Traveling is a great way to gain new perspectives. I love exploring new places, meeting different people, and experiencing diverse cultures. Each trip is a new learning opportunity, and it recharges my creativity and enthusiasm for my work.",
      color: "bg-pink-500/10 text-pink-600"
    },
    {
      icon: Users,
      title: "Networking",
      description: "Building professional relationships and community engagement",
      detailedDescription: "Building a strong professional network is incredibly important to me. I actively participate in tech meetups, seminars, and online communities. Connecting with other professionals helps me stay informed and find new opportunities for collaboration and growth.",
      color: "bg-indigo-500/10 text-indigo-600"
    }
  ];

  const handleHobbyClick = (hobby) => {
    setSelectedHobby(hobby);
    setIsModalOpen(true);
  };

  return (
    <section id="hobbies" className="section-standard">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Hobbies & Interests
        </Badge>
        <h2 className="text-gradient mb-6">
          Beyond Professional Life
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A balanced lifestyle with diverse interests that contribute to personal growth
          and bring fresh perspectives to my professional work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hobbies.map((hobby, index) => (
          <Card
            key={hobby.title}
            className="card-premium group hover:border-accent/30 cursor-pointer"
            onClick={() => handleHobbyClick(hobby)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="space-y-4 text-center">
              <div className={`w-16 h-16 mx-auto rounded-xl ${hobby.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <hobby.icon className="w-8 h-8" />
              </div>
             
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {hobby.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {hobby.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Personal Philosophy */}
      <div className="mt-16 text-center">
        <Card className="card-glow max-w-4xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Personal Philosophy
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground">Continuous Learning</h4>
                <p className="text-muted-foreground text-sm">
                  Embracing lifelong learning through reading, experimentation, and staying
                  current with technology trends.
                </p>
              </div>
             
              <div className="space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground">Community Building</h4>
                <p className="text-muted-foreground text-sm">
                  Building meaningful connections and contributing to the growth of
                  the technology education community.
                </p>
              </div>
             
              <div className="space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground">Work-Life Balance</h4>
                <p className="text-muted-foreground text-sm">
                  Maintaining physical and mental well-being through diverse interests
                  and regular self-care practices.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Pop-up/Dialog for Hobbies */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader className="text-center">
            {selectedHobby && (
              <div className="space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-xl ${selectedHobby.color} flex items-center justify-center`}>
                  <selectedHobby.icon className="w-8 h-8" />
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedHobby.title}</DialogTitle>
              </div>
            )}
          </DialogHeader>
          {selectedHobby && (
            <DialogDescription className="text-center text-muted-foreground mt-4">
              {selectedHobby.detailedDescription}
            </DialogDescription>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hobbies;
