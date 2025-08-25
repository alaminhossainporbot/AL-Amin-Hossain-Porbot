import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// useProjects hook-ti ekhane ekta mock data hisebe dhorlam karon original file-ti available nei.
// apnar nijer proyojoner jonno apnake "@/hooks/usePortfolioData" file-ti toiri korte hobe.
const useProjects = () => {
  // Ami ekhane ekta dummy data use korchi. Apnar asal data ekhane add korun.
  const dummyData = [
    {
      id: "1",
      title: "Project: E-Commerce Website",
      description: "Built a responsive e-commerce platform using React and Tailwind CSS.",
     imageUrls: [
        "https://i.ibb.co/6RtczL95/IMG-3830.jpg",
        "https://i.ibb.co/bMfRtrch/Visitd.jpg",
        "https://placehold.co/600x400/444/fff?text=Project+1+Image+C"
      ],
      category: "Web Development",
      status: "Completed",
      featured: true,
      tags: ["React", "Tailwind CSS", "E-commerce"],
      date: "July 2024",
      demoUrl: "#",
      githubUrl: "#",
      details: "This project features a complete e-commerce workflow from product listing to a functional shopping cart and checkout process. It includes a modern, responsive UI design and state management for a seamless user experience. The backend is simulated, but the frontend architecture is production-ready."
    },
    {
      id: "2",
      title: "Industrial visit with trainees",
      description: "Our next generation is developing very well, they just need complete guidelines.",
      imageUrls: [
        "https://i.ibb.co/1tQ1RCn8/PXL-20250804-082243853.jpg",
        "https://i.ibb.co/QvWvDcN9/visit-n.jpg",
        "https://i.ibb.co/FbFbXTnp/visit2-n.jpg",
        "https://i.ibb.co/Gf7z2YPN/Visit8-n.jpg"
      ],
      category: "Blog",
      status: "Completed",
      featured: false,
      tags: ["Next.GEN", "Tutorial", "IT Support Service"],
      date: "August 2024",
      demoUrl: "#",
      githubUrl: "#",
      details: "This blog post walks beginners through the core concepts of Next.js, including file-system routing, server-side rendering, and API routes. It provides step-by-step instructions and code snippets to help users build their first server-rendered React application."
    },
    {
      id: "3",
      title: "Training: Advanced Python Workshop",
      description: "A three-day workshop covering advanced Python concepts and best practices.",
      imageUrls: [
        "https://i.ibb.co/GvX4SmRc/Whats-App-Image-2025-08-16-at-21-39-36-6e9ce5f4.jpg",
        "https://i.ibb.co/chz41DCv/received-1090910429050784.jpg",
        "https://i.ibb.co/3yKVYp8W/Whats-App-Image-2025-08-16-at-21-56-25-56a80429.jpg",
        "https://i.ibb.co/BVGryvkS/Whats-App-Image-2025-08-16-at-22-02-00-5a2f66d5.jpg"
      ],
      category: "Training",
      status: "Completed",
      featured: true,
      tags: ["Python", "Workshop", "Data Science"],
      date: "June 2024",
      demoUrl: "#",
      githubUrl: "#",
      details: "This workshop was designed for intermediate to advanced Python developers. Topics included multithreading, asynchronous programming, advanced data structures, and best practices for writing clean, efficient, and scalable Python code. The curriculum also covered an introduction to machine learning libraries."
    },
  ];

  return {
    data: dummyData,
    isLoading: false,
    error: null
  };
};

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1); // Chobi opacity state
  const modalContentRef = useRef(null); // Modal content-er jonno ref

  // Automatic slideshow and fade effect-er jonno useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out effect shuru korar age
      setImageOpacity(0);
      
      setTimeout(() => {
        // Image change koro
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.imageUrls.length);
        // Fade in effect-er jonno opacit 1 kore dao
        setImageOpacity(1);
      }, 500); // 0.5s por por image change hobe fade effect-er jonno
    }, 5000); // 5 seconds por por chobi change hobe

    return () => clearInterval(timer);
  }, [project.imageUrls.length]); // dependency-te imageUrls.length deya hoyeche

  const handleNextImage = () => {
    setImageOpacity(0);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.imageUrls.length);
      setImageOpacity(1);
    }, 500);
  };

  const handlePrevImage = () => {
    setImageOpacity(0);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.imageUrls.length) % project.imageUrls.length);
      setImageOpacity(1);
    }, 500);
  };

  // Baire click korle modal bondho korar jonno function
  const handleOutsideClick = (e) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 sm:p-6" 
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalContentRef} 
        className="relative bg-card text-foreground rounded-lg max-w-4xl w-full p-6 md:p-8 shadow-2xl animate-fade-in-up overflow-y-auto max-h-[90vh]"
      >
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img 
              src={project.imageUrls[currentImageIndex]} 
              alt={`${project.title} image ${currentImageIndex + 1}`} 
              className={`w-full h-auto object-cover max-h-[60vh] transition-opacity duration-500 ${imageOpacity === 1 ? 'opacity-100' : 'opacity-0'}`} 
            />
            {project.imageUrls.length > 1 && (
              <>
                <Button 
                  size="icon" 
                  onClick={handlePrevImage} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 text-white hover:bg-white/50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  size="icon" 
                  onClick={handleNextImage} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 text-white hover:bg-white/50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        
          {/* Project Details */}
          <div className="text-center">
            <h2 className="text-gradient text-2xl md:text-3xl font-bold mb-2">
              {project.title}
            </h2>
            <p className="text-lg text-muted-foreground">{project.description}</p>
          </div>
        
          <div className="prose dark:prose-invert max-w-none text-center">
            <p className="text-muted-foreground">{project.details}</p>
          </div>
        
          <div className="flex flex-wrap justify-center gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        
          <div className="flex justify-center gap-4 pt-4">
            {project.demoUrl && (
              <Button asChild className="group/btn">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" /> Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" asChild className="group/btn">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const Portfolio = () => {
  const { data: projects = [], isLoading, error } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null); 

  // Get unique categories from projects
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter projects by category
  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  if (isLoading) {
    return (
      <section id="portfolio" className="section-standard bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
            <div className="h-12 bg-muted rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="section-standard bg-gradient-subtle">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load projects at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="section-standard bg-gradient-subtle">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Portfolio & Projects
        </Badge>
        <h2 className="text-gradient mb-6">
          Training Programs & Educational Initiatives
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the educational programs, training initiatives, and technical projects
          I've developed to enhance ICT learning experiences.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="px-6 py-2"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <Card className="card-premium max-w-2xl mx-auto bg-accent/5 border-accent/20">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto">
                <ExternalLink className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  No Projects Found
                </h4>
                <p className="text-muted-foreground text-sm">
                  Projects are automatically fetched from Google Sheets.
                </p>
            </div>
              <Badge variant="outline" className="text-xs">
                Powered by Google Sheets API
              </Badge>
          </div>
          </Card>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
          <Card
            key={project.id}
            className="card-glow group overflow-hidden cursor-pointer" 
            style={{ animationDelay: `${index * 0.2}s` }}
            onClick={() => setSelectedProject(project)} 
          >
            <div className="space-y-6">
              {/* Project Image with Hover Overlay */}
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <img
                  src={project.imageUrls[0]}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* The overlay with animated text */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h4 className="text-white text-lg font-bold transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {project.title}
                  </h4>
                  <p className="text-white/80 text-sm transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    {project.description}
                  </p>
                </div>

                <div className="absolute top-4 right-4">
                  <Badge
                    variant={project.status === "Completed" ? "default" : "secondary"}
                    className="shadow-lg"
                  >
                    {project.status}
                  </Badge>
                </div>
                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="shadow-lg">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.date}
                    </div>
                  </div>
                 
                  <Badge variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {project.category}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-1"
                      style={{ animationDelay: `${(index * 0.2) + (tagIndex * 0.05)}s` }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {project.demoUrl && (
                    <Button
                      size="sm"
                      className="flex-1 group/btn"
                      variant="outline"
                      asChild
                    >
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        View Details
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="group/btn"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Github className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
          ))}
        </div>
      )}

      {/* Google Sheets Integration Notice */}
      <div className="mt-16 text-center">
        <Card className="card-premium max-w-2xl mx-auto bg-accent/5 border-accent/20">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto">
              <ExternalLink className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Dynamic Portfolio Management
              </h4>
              <p className="text-muted-foreground text-sm">
                Projects are automatically fetched from Google Sheets.
                Update the "Portfolio" sheet to add new work, training programs, and educational initiatives.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Powered by Google Sheets API
            </Badge>
          </div>
        </Card>
      </div>
      
      {/* Modal for Project Details */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default Portfolio;
