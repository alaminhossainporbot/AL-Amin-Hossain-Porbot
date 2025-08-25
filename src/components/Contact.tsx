import { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Zod schema for form validation
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const formRef = useRef();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const subjectValue = watch("subject");

  const contactInfo = [{
    icon: Mail,
    label: "Email",
    value: "alaminhossainporbot.bd@gmail.com",
    href: "mailto:alaminhossainporbot.bd@gmail.com",
    color: "bg-blue-500/10 text-blue-600"
  }, {
    icon: Phone,
    label: "Phone",
    value: "+8801880233082",
    href: "tel:+8801880233082",
    color: "bg-green-500/10 text-green-600"
  }, {
    icon: MapPin,
    label: "Location",
    value: "Bangladesh",
    href: "#",
    color: "bg-red-500/10 text-red-600"
  }, {
    icon: Clock,
    label: "Availability",
    value: "Monday - Friday, 9 AM - 6 PM",
    href: "#",
    color: "bg-purple-500/10 text-purple-600"
  }];

  const socialLinks = [{
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/alaminhossainporbot/",
    color: "hover:text-blue-600"
  }, {
    icon: Github,
    name: "GitHub",
    href: "https://github.com/alaminhossainporbot",
    color: "hover:text-gray-800 dark:hover:text-white"
  }, {
    icon: Twitter,
    name: "Twitter",
    href: "https://x.com/PorbotAl",
    color: "hover:text-blue-400"
  }];

  const handleSendMessage = async (values) => {
    setIsSubmitting(true);
    
    // EmailJS Credentials
    const serviceId = 'service_emzztfe';
    const templateId = 'template_8hdy277';
    const publicKey = 'tHbx9N24HnvVqrwlf';

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: values.fullName,
            from_email: values.email,
            subject: values.subject,
            message: values.message,
          },
        }),
      });

      if (response.ok) {
        // Show a success notification
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        // Reset the form
        form.reset();
      } else {
        throw new Error('EmailJS API response was not OK.');
      }
    } catch (error) {
      // Show an error notification if sending fails
      console.error('Failed to send email:', error);
      toast({
        title: "Error",
        description: "Failed to send the message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMessageDraft = async () => {
    if (!subjectValue) {
      toast({
        title: "Subject Required",
        description: "Please enter a subject to generate a message draft.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `Write a professional and friendly message draft for a contact form. The user's subject is: "${subjectValue}". Start with "Hi AL Amin Hossain Porbot," and end with "Best regards, [Your Name]". The draft should be approximately 3-4 sentences long and directly related to the subject.`;
      
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setValue("message", text);
      } else {
        toast({
          title: "Generation Failed",
          description: "Could not generate a message draft. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: "API Error",
        description: "An error occurred while communicating with the AI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="contact" className="section-standard bg-gradient-subtle">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Contact
        </Badge>
        <h2 className="text-gradient mb-6">
          Let's Start a Conversation
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          If you are interested in ICT training, technical consultancy, or collaboration opportunities,
          I would love to hear from you. Let's discuss how we can work together.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-accent" />
              Contact Information
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => <Card key={info.label} className="card-premium group hover:border-accent/30" style={{
              animationDelay: `${index * 0.1}s`
            }}>
              <a href={info.href} className="flex items-start space-x-4 group-hover:text-accent transition-colors">
                <div className={`w-12 h-12 rounded-lg ${info.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <info.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {info.label}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed break-all text-sm">
                    {info.value}
                  </p>
                </div>
              </a>
            </Card>)}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">
              Connect on Social Media
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`} style={{
              animationDelay: `${index * 0.1}s`
            }} aria-label={social.name}>
                <social.icon className="w-5 h-5" />
              </a>)}
            </div>
          </div>

          {/* Additional Info */}
          <Card className="card-glow">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                Professional Services
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  ICT Training & Education
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  Technical Consultancy
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  Network Setup & Configuration
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  IT Support & Troubleshooting
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="card-glow">
          <form onSubmit={handleSubmit(handleSendMessage)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                Send a Message
              </h3>
              <p className="text-muted-foreground">
                Fill out the form below and I will get back to you as soon as possible.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...register("fullName")} placeholder="Your full name" className="transition-smooth focus:border-accent" />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" {...register("email")} type="email" placeholder="Your email@example.com" className="transition-smooth focus:border-accent" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <div className="flex items-center gap-2">
                <Input id="subject" {...register("subject")} placeholder="What's this about?" className="transition-smooth focus:border-accent" />
                <Button 
                  type="button" 
                  onClick={generateMessageDraft} 
                  disabled={isGenerating} 
                  variant="outline" 
                  size="icon"
                  className="shrink-0"
                  title="Generate a message draft with AI"
                >
                  <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                {...register("message")}
                rows={6}
                placeholder="Tell me about your project, questions, or how I can help you..."
                className="transition-smooth focus:border-accent resize-none"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="w-full btn-hero group" disabled={isSubmitting}>
              {isSubmitting ? <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending Message...
                </div> : <>
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </>}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
