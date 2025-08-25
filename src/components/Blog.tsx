import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Clock, Tag, X } from 'lucide-react';

// This is dummy data for demonstration purposes only. Your project would have real data.
const mockBlogPosts = [
  {
    id: 'intro-to-react',
    title: 'Intro to React: Building Your First Component',
    summary: 'A comprehensive guide for beginners to start with React. Learn how to set up your environment and build your very first component step by step.',
    content: 'React is a JavaScript library for building user interfaces. It lets you create complex UIs from small and isolated pieces of code called "components." This article will walk you through the entire process, from setting up your development environment to understanding JSX and state. The component-based architecture of React makes it highly efficient for building scalable and maintainable applications. You can reuse components, manage state effectively, and build a single-page application with a smooth user experience.',
    tags: ['React', 'JavaScript', 'WebDev', 'Beginner'],
    publishDate: '2024-07-20',
    readingTime: 12,
    imageUrl: 'https://placehold.co/600x400/334155/E2E8F0?text=React+Intro',
    bodyImageUrl: 'https://placehold.co/400x300/4F46E5/ffffff?text=In-Article+Image'
  },
  {
    id: 'css-with-tailwind',
    title: 'Styling with Tailwind CSS: A Modern Approach',
    summary: 'Tailwind CSS is a utility-first CSS framework that allows you to build custom designs quickly. Discover how to use Tailwind to streamline your styling workflow and create beautiful, responsive layouts.',
    content: 'Tailwind CSS has gained immense popularity for its unique approach to styling. Instead of writing custom CSS, you use pre-defined utility classes directly in your HTML. This article delves into the benefits of this approach and provides practical examples for common design patterns. It emphasizes speed and consistency, allowing developers to build beautiful user interfaces without ever leaving their HTML files.',
    tags: ['CSS', 'Tailwind', 'Design', 'WebDev'],
    publishDate: '2024-07-15',
    readingTime: 8,
    imageUrl: 'https://placehold.co/600x400/475569/E2E8F0?text=Tailwind+CSS',
    // Using a sample video URL for demonstration purposes
    bodyVideoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
  },
  {
    id: 'ict-skills',
    title: '5 Essential Skills for a Modern ICT Professional',
    summary: 'In a rapidly evolving digital landscape, staying relevant requires continuous learning. This article highlights the five key skills that every ICT professional should master to succeed in the modern era.',
    content: 'The ICT industry is in constant flux, with new technologies emerging every day. To remain competitive, professionals need to continuously upgrade their skill sets. This post focuses on critical skills like cloud computing, cybersecurity, data analysis, and effective communication, all of which are vital for a successful career in today\'s digital world.',
    tags: ['ICT', 'Skills', 'Career', 'Future'],
    publishDate: '2024-05-15',
    readingTime: 7,
    imageUrl: 'https://placehold.co/600x400/1E293B/E2E8F0?text=ICT+Skills',
    bodyImageUrl: 'https://placehold.co/400x300/10B981/ffffff?text=Professional+Dev'
  },
];

// Helper function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Blog = () => {
  // state hooks to manage the modal and selected post
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate data fetching here (in a real app, you would use your hook)
    const fetchPosts = () => {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        try {
          setBlogPosts(mockBlogPosts);
          setIsLoading(false);
        } catch (err) {
          setError(err);
          setIsLoading(false);
        }
      }, 1000); // 1-second delay
    };
    fetchPosts();
  }, []);

  // Function to open the modal and set the selected post
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <section id="blog" className="section-standard">
        <div className="text-center">
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="blog" className="section-standard">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load blog posts at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="section-standard bg-gradient-subtle">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Blog & Articles
        </Badge>
        <h2 className="text-gradient mb-6">
          Insights & Knowledge Sharing
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore my thoughts on technology, education, and professional development
          in the ever-evolving ICT landscape.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {blogPosts.map((post, index) => (
          <Card 
            key={post.id}
            className="card-glow group overflow-hidden bg-background border-border hover:shadow-xl hover:shadow-accent/10 transition-shadow duration-300 cursor-pointer"
            onClick={() => handlePostClick(post)}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="relative">
              {/* Conditional rendering for either image or video at the top */}
              {post.imageUrl && (
                <div className="relative overflow-hidden rounded-t-xl bg-muted">
                  <img 
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-accent" />
                      {formatDate(post.publishDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-accent" />
                      {post.readingTime} min read
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {post.summary}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="secondary" 
                        className="text-xs px-2 py-1 rounded-full border border-border"
                      >
                        <Tag className="w-3 h-3 mr-1 opacity-70" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Conditional Rendering for the Modal */}
      {isModalOpen && selectedPost && (
        // The outer div now has an onClick handler to close the modal
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={handleCloseModal}
        >
          {/* The inner div has an onClick handler to stop the event from bubbling up */}
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border border-border shadow-lg animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal close button with better styling */}
            <Button 
              onClick={handleCloseModal}
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-card border border-border/50 text-foreground hover:bg-card/80 hover:scale-110 transition-transform z-10"
            >
              <X className="w-5 h-5" />
            </Button>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Image at the top */}
              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-80 object-cover rounded-xl"
                />
              )}
              
              {/* Title and Details */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold">{selectedPost.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-accent" />
                    {formatDate(selectedPost.publishDate)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-accent" />
                    {selectedPost.readingTime} min read
                  </div>
                </div>
              </div>
              
              {/* Main content with floating body image or video */}
              <div className="prose prose-sm md:prose-base text-foreground max-w-none">
                {/* Conditional rendering for in-article image or video */}
                {selectedPost.bodyImageUrl && (
                  <img
                    src={selectedPost.bodyImageUrl}
                    alt="Article Image"
                    // On desktop, the image floats right with margin. On mobile, it's a full-width block.
                    className="float-none md:float-right w-full md:w-1/2 rounded-lg object-cover mb-4 md:ml-4"
                  />
                )}
                {selectedPost.bodyVideoUrl && (
                  <video 
                    src={selectedPost.bodyVideoUrl} 
                    alt="Article Video"
                    // On desktop, the video floats right. On mobile, it's a full-width block.
                    className="float-none md:float-right w-full md:w-1/2 rounded-lg object-cover mb-4 md:ml-4"
                    controls loop muted playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                <p>{selectedPost.content}</p>
              </div>
              
              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedPost.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary" 
                      className="text-xs px-2 py-1 rounded-full border border-border"
                    >
                      <Tag className="w-3 h-3 mr-1 opacity-70" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Integration Notice */}
      <div className="mt-16 text-center">
        <Card className="card-premium max-w-2xl mx-auto bg-card border-accent/20 shadow-lg">
          <div className="p-6 space-y-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto animate-float">
              <ExternalLink className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Dynamic Content Management
              </h4>
              <p className="text-muted-foreground text-sm">
                Blog posts are automatically fetched from Google Sheets.
                Simply update the "Blog" sheet with new articles to see them appear here instantly.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              Powered by Google Sheets API
            </Badge>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Blog;
