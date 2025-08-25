import { GoogleSheetsData, PersonalInfo, Skill, Certificate, Project, BlogPost, ContactInfo } from './types';
import { googleAppsScriptAuth } from './googleAppsScriptAuth';

// All data is now fetched via Google Apps Script. Direct access to Google Sheets API is disabled.
// Legacy config kept for backward compatibility but no longer used.
let GOOGLE_SHEETS_API_KEY = '';
let SPREADSHEET_ID = '';

// Load configuration from localStorage (kept for compatibility with AdminConfig UI)
const loadConfig = () => {
  try {
    const saved = localStorage.getItem('admin_config');
    if (saved) {
      const config = JSON.parse(saved);
      GOOGLE_SHEETS_API_KEY = config.googleSheetsApiKey || '';
      SPREADSHEET_ID = config.portfolioSpreadsheetId || '';
    }
  } catch (error) {
    console.error('Error loading Google Sheets config:', error);
  }
};

// Global function to update config (called from AdminConfig)
(window as any).updateGoogleSheetsConfig = (apiKey: string, spreadsheetId: string) => {
  GOOGLE_SHEETS_API_KEY = apiKey;
  SPREADSHEET_ID = spreadsheetId;
};

class GoogleSheetsService {
  private async fetchSheetData(range: string): Promise<any[][]> {
    try {
      // Always fetch through Apps Script
      const result = await googleAppsScriptAuth.makeAuthenticatedRequest('getPortfolioData');
      const data = result?.data || {};

      // Determine sheet from range like "SheetName!A2:Z"
      const sheetName = range.split('!')[0];
      let rows: any[][] = [];

      switch (sheetName) {
        case 'Home':
          rows = Array.isArray(data.personalInfo) ? data.personalInfo : [];
          // Return only the first data row to match previous expectations
          return rows.length > 1 ? [rows[1]] : [];
        case 'Skills':
          rows = Array.isArray(data.skills) ? data.skills : [];
          return rows.slice(1);
        case 'Certificates':
          rows = Array.isArray(data.certificates) ? data.certificates : [];
          return rows.slice(1);
        case 'Portfolio':
          rows = Array.isArray(data.projects) ? data.projects : [];
          return rows.slice(1);
        case 'Blog':
          rows = Array.isArray(data.blogPosts) ? data.blogPosts : [];
          return rows.slice(1);
        case 'Contact':
          rows = Array.isArray(data.contactInfo) ? data.contactInfo : [];
          return rows.length > 1 ? [rows[1]] : [];
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error fetching sheet data via Apps Script for range ${range}:`, error);
      return [];
    }
  }

  async getPersonalInfo(): Promise<PersonalInfo> {
    try {
      const data = await this.fetchSheetData('Home!A2:H2');
      if (data.length === 0) {
        return this.getDefaultPersonalInfo();
      }
      
      const [row] = data;
      return {
        name: row[0] || 'AL Amin Hossain Porbot',
        title: row[1] || 'ICT Trainer & Technology Specialist',
        bio: row[2] || 'A motivated, creative, and responsible ICT professional...',
        email: row[3] || 'alaminhossainporbot.bd@gmail.com',
        phone: row[4] || '01880233082',
        location: row[5] || 'Bangladesh',
        profileImageUrl: row[6] || '',
        cvFileUrl: row[7] || ''
      };
    } catch (error) {
      console.error('Error fetching personal info:', error);
      return this.getDefaultPersonalInfo();
    }
  }

  async getSkills(): Promise<Skill[]> {
    try {
      const data = await this.fetchSheetData('Skills!A2:D100');
      return data.map(row => ({
        name: row[0] || '',
        level: parseInt(row[1]) || 0,
        category: row[2] || 'General',
        icon: row[3] || ''
      })).filter(skill => skill.name);
    } catch (error) {
      console.error('Error fetching skills:', error);
      return this.getDefaultSkills();
    }
  }

  async getCertificates(): Promise<Certificate[]> {
    try {
      const data = await this.fetchSheetData('Certificates!A2:G100');
      return data.map((row, index) => ({
        id: `cert-${index + 1}`,
        title: row[0] || '',
        issuer: row[1] || '',
        date: row[2] || '',
        description: row[3] || '',
        imageUrl: row[4] || '',
        credentialUrl: row[5] || ''
      })).filter(cert => cert.title);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return this.getDefaultCertificates();
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const data = await this.fetchSheetData('Portfolio!A2:J100');
      return data.map((row, index) => ({
        id: `project-${index + 1}`,
        title: row[0] || '',
        description: row[1] || '',
        imageUrl: row[2] || '/placeholder.svg',
        demoUrl: row[3] || '',
        githubUrl: row[4] || '',
        tags: (row[5] || '').split(',').map((tag: string) => tag.trim()).filter(Boolean),
        category: row[6] || 'General',
        date: row[7] || '',
        status: (row[8] as 'Completed' | 'Ongoing' | 'Planned') || 'Completed',
        featured: row[9]?.toLowerCase() === 'true'
      })).filter(project => project.title);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return this.getDefaultProjects();
    }
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const data = await this.fetchSheetData('Blog!A2:H100');
      return data.map((row, index) => ({
        id: `blog-${index + 1}`,
        title: row[0] || '',
        summary: row[1] || '',
        imageUrl: row[2] || '',
        publishDate: row[3] || '',
        readingTime: parseInt(row[4]) || 5,
        tags: (row[5] || '').split(',').map((tag: string) => tag.trim()).filter(Boolean),
        externalUrl: row[6] || ''
      })).filter(blog => blog.title);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  async getContactInfo(): Promise<ContactInfo> {
    try {
      const data = await this.fetchSheetData('Contact!A2:H2');
      if (data.length === 0) {
        return this.getDefaultContactInfo();
      }
      
      const [row] = data;
      return {
        email: row[0] || 'alaminhossainporbot.bd@gmail.com',
        phone: row[1] || '01880233082',
        location: row[2] || 'Bangladesh',
        socialLinks: {
          linkedin: row[3] || '',
          github: row[4] || '',
          twitter: row[5] || '',
          facebook: row[6] || ''
        }
      };
    } catch (error) {
      console.error('Error fetching contact info:', error);
      return this.getDefaultContactInfo();
    }
  }

  async getAllData(): Promise<GoogleSheetsData> {
    const [personalInfo, skills, certificates, projects, blogPosts, contactInfo] = await Promise.all([
      this.getPersonalInfo(),
      this.getSkills(),
      this.getCertificates(),
      this.getProjects(),
      this.getBlogPosts(),
      this.getContactInfo()
    ]);

    return {
      personalInfo,
      skills,
      certificates,
      projects,
      blogPosts,
      contactInfo
    };
  }

  // Default data fallbacks
  private getDefaultPersonalInfo(): PersonalInfo {
    return {
      name: 'AL Amin Hossain Porbot',
      title: 'ICT Trainer & Technology Specialist',
      bio: 'A motivated, creative, and responsible ICT professional with ENFP personality. Passionate about empowering others through technology education and delivering innovative solutions in computer training and technical support.',
      email: 'alaminhossainporbot.bd@gmail.com',
      phone: '01880233082',
      location: 'Bangladesh',
      profileImageUrl: '',
      cvFileUrl: ''
    };
  }

  private getDefaultSkills(): Skill[] {
    return [
      { name: 'Computer Assembly', level: 95, category: 'Hardware' },
      { name: 'Network Configuration', level: 90, category: 'Networking' },
      { name: 'Mikrotik Setup', level: 85, category: 'Networking' },
      { name: 'Cisco Networking', level: 80, category: 'Networking' },
      { name: 'IT Support', level: 92, category: 'Technical Support' },
      { name: 'Windows Administration', level: 88, category: 'Operating Systems' },
      { name: 'Linux Basics', level: 75, category: 'Operating Systems' },
      { name: 'Training & Education', level: 95, category: 'Teaching' },
      { name: 'Microsoft Office', level: 90, category: 'Office Applications' },
      { name: 'Technical Documentation', level: 85, category: 'Documentation' }
    ];
  }

  private getDefaultCertificates(): Certificate[] {
    return [
      {
        id: 'cert-1',
        title: 'IT Support Services Certificate',
        issuer: 'Professional Institute',
        date: '2023',
        description: 'Comprehensive certification in IT support services, covering hardware diagnostics, software troubleshooting, and customer service.',
        imageUrl: '',
        credentialUrl: ''
      }
    ];
  }

  private getDefaultProjects(): Project[] {
    return [
      {
        id: 'project-1',
        title: 'Network Infrastructure Training Lab',
        description: 'Comprehensive networking lab setup for hands-on training with Mikrotik and Cisco equipment. Students learn real-world network configuration and troubleshooting.',
        imageUrl: '/placeholder.svg',
        demoUrl: '',
        githubUrl: '',
        tags: ['Networking', 'Mikrotik', 'Cisco', 'Training'],
        category: 'Educational',
        date: '2023',
        status: 'Ongoing',
        featured: true
      },
      {
        id: 'project-2',
        title: 'Computer Assembly Workshop Series',
        description: 'Interactive workshop series teaching students computer hardware assembly, maintenance, and troubleshooting techniques with modern equipment.',
        imageUrl: '/placeholder.svg',
        demoUrl: '',
        githubUrl: '',
        tags: ['Hardware', 'Assembly', 'Workshop', 'Training'],
        category: 'Educational',
        date: '2023',
        status: 'Completed',
        featured: false
      }
    ];
  }

  private getDefaultContactInfo(): ContactInfo {
    return {
      email: 'alaminhossainporbot.bd@gmail.com',
      phone: '01880233082',
      location: 'Bangladesh',
      socialLinks: {
        linkedin: '',
        github: '',
        twitter: '',
        facebook: ''
      }
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();