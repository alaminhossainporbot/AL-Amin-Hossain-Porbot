import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  FileText, 
  Image, 
  Folder, 
  Download, 
  Upload, 
  ArrowUpDown,
  Edit,
  Save,
  RefreshCw,
  Shield,
  History,
  Users,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  Award,
  MapPin,
  Phone,
  Mail,
  Link2
} from 'lucide-react';
import { PersonalInfo } from '@/lib/types';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminConfig } from '@/components/AdminConfig';
import { AdminSetupGuide } from '@/components/AdminSetupGuide';
import { DebugConsole } from '@/components/DebugConsole';
import { SheetsDiagnostic } from '@/components/SheetsDiagnostic';
import { googleAppsScriptAuth } from '@/lib/googleAppsScriptAuth';
import { 
  usePersonalInfo, 
  useSkills, 
  useCertificates, 
  useProjects, 
  useBlogPosts, 
  useContactInfo 
} from '@/hooks/usePortfolioData';

const AdminPanel = () => {
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [adminConfig, setAdminConfig] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Query hooks for data
  const personalInfoQuery = usePersonalInfo();
  const skillsQuery = useSkills();
  const certificatesQuery = useCertificates();
  const projectsQuery = useProjects();
  const blogPostsQuery = useBlogPosts();
  const contactInfoQuery = useContactInfo();

  const personalInfoForm = useForm<PersonalInfo>({
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      location: '',
    },
  });


  useEffect(() => {}, []);

  const loadDriveFiles = async () => {
    setIsLoading(true);
    try {
      setDriveFiles([]);
      toast({
        title: 'Drive browsing disabled',
        description: 'All data now syncs via Google Apps Script.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncPortfolioData = async () => {
    setIsLoading(true);
    try {
      const result = await googleAppsScriptAuth.makeAuthenticatedRequest('getPortfolioData');
      const rows = Array.isArray(result?.data?.projects) ? result.data.projects : [];
      const count = Math.max(0, rows.length - 1);
      toast({
        title: 'Portfolio synced',
        description: `Loaded ${count} projects via Apps Script`,
      });
    } catch (error) {
      toast({
        title: 'Sync failed',
        description: 'Error syncing portfolio data via Apps Script',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncPersonalInfo = async () => {
    setIsLoading(true);
    try {
      const result = await googleAppsScriptAuth.makeAuthenticatedRequest('getPortfolioData');
      const rows = Array.isArray(result?.data?.personalInfo) ? result.data.personalInfo : [];
      const row = rows.length > 1 ? rows[1] : [];
      const info = {
        name: row[0] || '',
        title: row[1] || '',
        bio: row[2] || '',
        email: row[3] || '',
        phone: row[4] || '',
        location: row[5] || '',
      } as PersonalInfo;
      personalInfoForm.reset(info);
      setPersonalInfo(info);
      toast({
        title: 'Personal info synced',
        description: 'Loaded personal information via Apps Script',
      });
    } catch (error) {
      toast({
        title: 'Sync failed',
        description: 'Error syncing personal info via Apps Script',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePersonalInfo = async (data: PersonalInfo) => {
    setIsLoading(true);
    try {
      const updates = [
        ['Name','Title','Bio','Email','Phone','Location','ProfileImageUrl','CvFileUrl'],
        [data.name, data.title, data.bio, data.email, data.phone, data.location, '', ''],
      ];

      await googleAppsScriptAuth.makeAuthenticatedRequest('updatePortfolioData', {
        sheetName: 'Home',
        updates,
      });

      await googleAppsScriptAuth.logAction('UPDATE_PERSONAL_INFO', {
        fields: Object.keys(data),
        timestamp: new Date().toISOString(),
      });

      toast({
        title: 'Saved successfully',
        description: 'Personal information updated via Apps Script',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Error saving via Apps Script',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const result = await googleAppsScriptAuth.getAuditLogs(20);
      setAuditLogs(result.data?.logs || []);
      toast({
        title: "Audit logs loaded",
        description: `Found ${result.data?.logs?.length || 0} recent actions`,
      });
    } catch (error) {
      toast({
        title: "Error loading audit logs",
        description: "Failed to retrieve audit information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminConfig = async () => {
    setIsLoading(true);
    try {
      const result = await googleAppsScriptAuth.getAdminConfig();
      setAdminConfig(result.data || {});
      toast({
        title: "Configuration loaded",
        description: "Admin settings retrieved successfully",
      });
    } catch (error) {
      toast({
        title: "Error loading configuration",
        description: "Failed to retrieve admin settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portfolio Admin</h1>
            <p className="text-muted-foreground">Manage your portfolio content via Google Drive</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Connected via Google Apps Script
          </Badge>
        </div>

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostic">
            <SheetsDiagnostic />
          </TabsContent>

          <TabsContent value="setup">
            <AdminSetupGuide />
          </TabsContent>

          <TabsContent value="config">
            <div className="space-y-6">
              <AdminConfig />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Sync and manage your portfolio data from Google Sheets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={syncPersonalInfo} disabled={isLoading}>
                        <Download className="h-4 w-4 mr-2" />
                        Sync Personal Info
                      </Button>
                      <Button onClick={syncPortfolioData} disabled={isLoading}>
                        <Download className="h-4 w-4 mr-2" />
                        Sync Portfolio Projects
                      </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">How to Input Data:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Create Google Sheets with your portfolio data</li>
                        <li>• Use the sync buttons above to load existing data</li>
                        <li>• Edit data in the respective tabs (Personal, Experience, etc.)</li>
                        <li>• Data is automatically saved back to Google Sheets</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drive">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Google Drive Files
                </CardTitle>
                <CardDescription>
                  Files in your Google Drive that can be used for portfolio content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button onClick={loadDriveFiles} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Files
                  </Button>
                </div>
                <div className="grid gap-2">
                  {driveFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {file.mimeType.includes('spreadsheet') ? <FileText className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Modified: {new Date(file.modifiedTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{file.mimeType.split('/')[1]}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Edit your personal details and bio information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...personalInfoForm}>
                  <form onSubmit={personalInfoForm.handleSubmit(savePersonalInfo)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={personalInfoForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={personalInfoForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={personalInfoForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Google Drive
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Work Experience
                </CardTitle>
                <CardDescription>
                  Manage your work experience and employment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" onClick={async () => {
                    setIsLoading(true);
                    try {
                      await googleAppsScriptAuth.makeAuthenticatedRequest('addExperience', {});
                      await googleAppsScriptAuth.logAction('ADD_NEW_EXPERIENCE');
                      toast({ title: 'Request sent', description: 'Add Experience request sent to Apps Script' });
                    } catch (error) {
                      toast({ title: 'Action failed', description: 'Could not add experience via Apps Script', variant: 'destructive' });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Experience
                  </Button>
                  <div className="space-y-3">
                    {/* Sample experience entries */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div>
                            <h3 className="font-semibold">ICT Trainer</h3>
                            <p className="text-sm text-muted-foreground">Technology Institute</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>2020 - Present</span>
                          </div>
                          <p className="text-sm">Leading comprehensive ICT training programs, specializing in computer assembly, networking, and technical support.</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Google Sheets Integration:</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a sheet named "Experience" with columns: Company, Position, Start Date, End Date, Description, Skills
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Education
                </CardTitle>
                <CardDescription>
                  Manage your educational background and qualifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" onClick={async () => {
                    setIsLoading(true);
                    try {
                      await googleAppsScriptAuth.makeAuthenticatedRequest('addEducation', {});
                      await googleAppsScriptAuth.logAction('ADD_NEW_EDUCATION');
                      toast({ title: 'Request sent', description: 'Add Education request sent to Apps Script' });
                    } catch (error) {
                      toast({ title: 'Action failed', description: 'Could not add education via Apps Script', variant: 'destructive' });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Education
                  </Button>
                  <div className="space-y-3">
                    {/* Sample education entries */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div>
                            <h3 className="font-semibold">Diploma in Computer Science & Technology</h3>
                            <p className="text-sm text-muted-foreground">Technical College</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>2018 - 2022</span>
                          </div>
                          <p className="text-sm">Specialized in computer networking, hardware maintenance, and IT support services.</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Google Sheets Integration:</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a sheet named "Education" with columns: Institution, Degree, Field, Start Year, End Year, GPA, Description
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Skills & Technologies
                </CardTitle>
                <CardDescription>
                  Manage your technical skills and proficiency levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" onClick={async () => {
                    setIsLoading(true);
                    try {
                      await googleAppsScriptAuth.makeAuthenticatedRequest('addSkill', {});
                      await googleAppsScriptAuth.logAction('ADD_NEW_SKILL');
                      toast({ title: 'Request sent', description: 'Add Skill request sent to Apps Script' });
                    } catch (error) {
                      toast({ title: 'Action failed', description: 'Could not add skill via Apps Script', variant: 'destructive' });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Skill
                  </Button>
                  
                  {skillsQuery.isLoading ? (
                    <p className="text-center text-muted-foreground py-4">Loading skills...</p>
                  ) : (
                    <div className="space-y-3">
                      {skillsQuery.data?.map((skill, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{skill.name}</h3>
                                <Badge variant="secondary">{skill.category}</Badge>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all" 
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">{skill.level}% proficiency</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-center text-muted-foreground py-4">No skills found</p>}
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Google Sheets Integration:</h4>
                    <p className="text-sm text-muted-foreground">
                      Skills are loaded from the "Skills" sheet with columns: Name, Level, Category, Icon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Certificates & Achievements
                </CardTitle>
                <CardDescription>
                  Manage your professional certificates and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" onClick={async () => {
                    setIsLoading(true);
                    try {
                      await googleAppsScriptAuth.makeAuthenticatedRequest('addCertificate', {});
                      await googleAppsScriptAuth.logAction('ADD_NEW_CERTIFICATE');
                      toast({ title: 'Request sent', description: 'Add Certificate request sent to Apps Script' });
                    } catch (error) {
                      toast({ title: 'Action failed', description: 'Could not add certificate via Apps Script', variant: 'destructive' });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Certificate
                  </Button>
                  
                  {certificatesQuery.isLoading ? (
                    <p className="text-center text-muted-foreground py-4">Loading certificates...</p>
                  ) : (
                    <div className="space-y-3">
                      {certificatesQuery.data?.map((cert) => (
                        <div key={cert.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div>
                                <h3 className="font-semibold">{cert.title}</h3>
                                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{cert.date}</span>
                              </div>
                              <p className="text-sm">{cert.description}</p>
                              {cert.credentialUrl && (
                                <Button variant="link" size="sm" className="p-0 h-auto">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View Credential
                                </Button>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-center text-muted-foreground py-4">No certificates found</p>}
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Google Sheets Integration:</h4>
                    <p className="text-sm text-muted-foreground">
                      Certificates are loaded from the "Certificates" sheet with columns: Title, Issuer, Date, Description, ImageURL, CredentialURL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Portfolio Projects
                </CardTitle>
                <CardDescription>
                  Manage your portfolio projects and showcase work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" onClick={async () => {
                    setIsLoading(true);
                    try {
                      await googleAppsScriptAuth.makeAuthenticatedRequest('addProject', {});
                      await googleAppsScriptAuth.logAction('ADD_NEW_PROJECT');
                      toast({ title: 'Request sent', description: 'Add Project request sent to Apps Script' });
                    } catch (error) {
                      toast({ title: 'Action failed', description: 'Could not add project via Apps Script', variant: 'destructive' });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Button>
                  
                  {projectsQuery.isLoading ? (
                    <p className="text-center text-muted-foreground py-4">Loading projects...</p>
                  ) : (
                    <div className="space-y-3">
                      {projectsQuery.data?.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div>
                                <h3 className="font-semibold">{project.title}</h3>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{project.date}</span>
                                <Badge variant="outline">{project.status}</Badge>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                {project.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                                {project.featured && <Badge variant="default">Featured</Badge>}
                              </div>
                              <div className="flex gap-2">
                                {project.demoUrl && (
                                  <Button variant="link" size="sm" className="p-0 h-auto">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Demo
                                  </Button>
                                )}
                                {project.githubUrl && (
                                  <Button variant="link" size="sm" className="p-0 h-auto">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    GitHub
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-center text-muted-foreground py-4">No projects found</p>}
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Google Sheets Integration:</h4>
                    <p className="text-sm text-muted-foreground">
                      Projects are loaded from the "Projects" sheet with columns: Title, Description, ImageURL, DemoURL, GitHubURL, Tags, Category, Date, Status, Featured
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Blog Posts
                </CardTitle>
                <CardDescription>
                  Manage your blog posts and articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" onClick={async () => {
                    setIsLoading(true);
                    try {
                      await googleAppsScriptAuth.makeAuthenticatedRequest('addBlogPost', {});
                      await googleAppsScriptAuth.logAction('ADD_NEW_BLOG_POST');
                      toast({ title: 'Request sent', description: 'Add Blog Post request sent to Apps Script' });
                    } catch (error) {
                      toast({ title: 'Action failed', description: 'Could not add blog post via Apps Script', variant: 'destructive' });
                    } finally {
                      setIsLoading(false);
                    }
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Blog Post
                  </Button>
                  
                  {blogPostsQuery.isLoading ? (
                    <p className="text-center text-muted-foreground py-4">Loading blog posts...</p>
                  ) : (
                    <div className="space-y-3">
                      {blogPostsQuery.data?.map((post) => (
                        <div key={post.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div>
                                <h3 className="font-semibold">{post.title}</h3>
                                <p className="text-sm text-muted-foreground">{post.summary}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{post.publishDate}</span>
                                <span>•</span>
                                <span>{post.readingTime} min read</span>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                              </div>
                              {post.externalUrl && (
                                <Button variant="link" size="sm" className="p-0 h-auto">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Read Article
                                </Button>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-center text-muted-foreground py-4">No blog posts found</p>}
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Google Sheets Integration:</h4>
                    <p className="text-sm text-muted-foreground">
                      Blog posts are loaded from the "Blog" sheet with columns: Title, Summary, ImageURL, PublishDate, ReadingTime, Tags, ExternalURL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hobbies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Hobbies & Interests
                </CardTitle>
                <CardDescription>
                  Manage your personal hobbies and interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Hobby
                  </Button>
                  
                  <div className="space-y-3">
                    {/* Sample hobbies data */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold">Technology Research</h3>
                          <p className="text-sm text-muted-foreground">Staying updated with latest IT trends and emerging technologies</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold">Hardware Tinkering</h3>
                          <p className="text-sm text-muted-foreground">Experimenting with computer components and building custom systems</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Google Sheets Integration:</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a sheet named "Hobbies" with columns: Name, Description, Category, ImageURL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Manage your contact details and social links
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactInfoQuery.isLoading ? (
                  <p className="text-center text-muted-foreground py-4">Loading contact info...</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-email">Email</Label>
                        <Input 
                          id="contact-email" 
                          defaultValue={contactInfoQuery.data?.email} 
                          placeholder="your@email.com" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Phone</Label>
                        <Input 
                          id="contact-phone" 
                          defaultValue={contactInfoQuery.data?.phone} 
                          placeholder="+1 (555) 123-4567" 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contact-location">Location</Label>
                      <Input 
                        id="contact-location" 
                        defaultValue={contactInfoQuery.data?.location} 
                        placeholder="City, Country" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input 
                          id="linkedin" 
                          defaultValue={contactInfoQuery.data?.socialLinks.linkedin} 
                          placeholder="https://linkedin.com/in/username" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub URL</Label>
                        <Input 
                          id="github" 
                          defaultValue={contactInfoQuery.data?.socialLinks.github} 
                          placeholder="https://github.com/username" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="twitter">Twitter URL</Label>
                        <Input 
                          id="twitter" 
                          defaultValue={contactInfoQuery.data?.socialLinks.twitter} 
                          placeholder="https://twitter.com/username" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook URL</Label>
                        <Input 
                          id="facebook" 
                          defaultValue={contactInfoQuery.data?.socialLinks.facebook} 
                          placeholder="https://facebook.com/username" 
                        />
                      </div>
                    </div>

                    {/* Current Data Display */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3">Current Contact Information:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{contactInfoQuery.data?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{contactInfoQuery.data?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{contactInfoQuery.data?.location}</span>
                        </div>
                        {contactInfoQuery.data?.socialLinks.linkedin && (
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            <span>LinkedIn: {contactInfoQuery.data.socialLinks.linkedin}</span>
                          </div>
                        )}
                        {contactInfoQuery.data?.socialLinks.github && (
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            <span>GitHub: {contactInfoQuery.data.socialLinks.github}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Google Sheets Integration:</h4>
                      <p className="text-sm text-muted-foreground">
                        Contact info is loaded from the "Contact" sheet with columns: Email, Phone, Location, LinkedIn, GitHub, Twitter, Facebook
                      </p>
                    </div>

                    <Button onClick={async () => {
                      setIsLoading(true);
                      try {
                        await googleAppsScriptAuth.makeAuthenticatedRequest('saveContactInfo', {});
                        await googleAppsScriptAuth.logAction('SAVE_CONTACT_INFO');
                        toast({ title: 'Request sent', description: 'Save Contact Info request sent to Apps Script' });
                      } catch (error) {
                        toast({ title: 'Action failed', description: 'Could not save contact info via Apps Script', variant: 'destructive' });
                      } finally {
                        setIsLoading(false);
                      }
                    }}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Contact Info
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Sync Data
                </CardTitle>
                <CardDescription>
                  Sync all your portfolio content from Google Sheets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Button onClick={syncPersonalInfo} disabled={isLoading}>
                      <Download className="h-4 w-4 mr-2" />
                      Sync Personal Info
                    </Button>
                    <Button onClick={syncPortfolioData} disabled={isLoading}>
                      <Download className="h-4 w-4 mr-2" />
                      Sync Portfolio Projects
                    </Button>
                    <Button disabled={isLoading}>
                      <Download className="h-4 w-4 mr-2" />
                      Sync All Data
                    </Button>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Expected Google Sheets Structure:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Personal Info - Basic personal details</li>
                      <li>• Experience - Work experience entries</li>
                      <li>• Education - Educational background</li>
                      <li>• Skills - Technical skills and levels</li>
                      <li>• Certificates - Professional certificates</li>
                      <li>• Portfolio - Project showcase</li>
                      <li>• Blog - Blog posts and articles</li>
                      <li>• Contact - Contact information and social links</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Audit Logs
                </CardTitle>
                <CardDescription>
                  View recent admin actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button onClick={loadAuditLogs} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Load Logs
                  </Button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{log.action}</Badge>
                            <span className="text-sm font-medium">{log.username}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.details}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No audit logs available. Click "Load Logs" to fetch recent actions.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Admin Settings
                </CardTitle>
                <CardDescription>
                  Configure admin panel preferences and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button onClick={loadAdminConfig} disabled={isLoading}>
                    <Download className="h-4 w-4 mr-2" />
                    Load Configuration
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Input 
                        type="number" 
                        defaultValue={adminConfig.sessionTimeout || 120}
                        placeholder="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Login Attempts</Label>
                      <Input 
                        type="number" 
                        defaultValue={adminConfig.maxLoginAttempts || 5}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Admin Email Notifications</Label>
                    <Input 
                      type="email" 
                      defaultValue={adminConfig.adminEmail || ''}
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Security Status:</h4>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Google Apps Script Authentication Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Admin = () => {
  return (
    <AuthGuard>
      <AdminPanel />
    </AuthGuard>
  );
};

export default Admin;