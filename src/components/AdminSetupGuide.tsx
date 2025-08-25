import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Key, 
  Database, 
  Link, 
  AlertCircle, 
  CheckCircle,
  ExternalLink,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const AdminSetupGuide = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description,
    });
  };

  const steps = [
    {
      title: "1. Create Google Cloud Project & Enable APIs",
      icon: <Key className="h-5 w-5" />,
      status: "required",
      content: (
        <div className="space-y-3">
          <p>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Create a new project or select existing one</li>
            <li>Enable Google Sheets API</li>
            <li>Go to APIs & Services → Credentials</li>
            <li>Create API Key (restrict to Google Sheets API)</li>
            <li>Copy the API key for configuration</li>
          </ul>
        </div>
      )
    },
    {
      title: "2. Create Google Sheets for Portfolio Data",
      icon: <Database className="h-5 w-5" />,
      status: "required",
      content: (
        <div className="space-y-3">
          <p>Create a Google Spreadsheet with these sheets:</p>
          <div className="bg-muted p-3 rounded text-sm">
            <strong>Sheet Names & Columns:</strong>
            <ul className="mt-2 space-y-1">
              <li><strong>Home:</strong> Name, Title, Bio, Email, Phone, Location, ProfileImageUrl, CVFileUrl</li>
              <li><strong>Skills:</strong> Name, Level, Category, Icon</li>
              <li><strong>Portfolio:</strong> Title, Description, ImageUrl, DemoUrl, GithubUrl, Tags, Category, Date, Status, Featured</li>
              <li><strong>Certificates:</strong> Title, Issuer, Date, Description, ImageUrl, CredentialUrl</li>
              <li><strong>Blog:</strong> Title, Summary, ImageUrl, PublishDate, ReadingTime, Tags, ExternalUrl</li>
              <li><strong>Contact:</strong> Email, Phone, Location, LinkedIn, GitHub, Twitter, Facebook</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Copy the Spreadsheet ID from the URL: /spreadsheets/d/<strong>[SPREADSHEET_ID]</strong>/
          </p>
        </div>
      )
    },
    {
      title: "3. Deploy Google Apps Script Backend",
      icon: <Link className="h-5 w-5" />,
      status: "required",
      content: (
        <div className="space-y-3">
          <p>Go to <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Apps Script</a></p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Create a new project</li>
            <li>Replace Code.gs content with the backend script</li>
            <li>Update ADMIN_SPREADSHEET_ID and PORTFOLIO_SPREADSHEET_ID</li>
            <li>Deploy as Web App (Execute as: Me, Access: Anyone)</li>
            <li>Copy the Web App URL</li>
          </ul>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>CORS Fix:</strong> Make sure your Apps Script includes proper CORS headers in the doGet() and doPost() functions.
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-3 rounded">
            <p className="text-sm font-medium mb-2">Sample CORS-enabled doGet function:</p>
            <pre className="text-xs overflow-x-auto">
{`function doGet(e) {
  const response = createResponse({ message: 'Service is running' });
  return response;
}

function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  return output;
}`}
            </pre>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => copyToClipboard(`function doGet(e) {
  const response = createResponse({ message: 'Service is running' });
  return response;
}

function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers - this is crucial for fixing CORS errors
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  return output;
}`, "Sample CORS function copied")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Sample Code
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "4. Configure Admin Panel",
      icon: <CheckCircle className="h-5 w-5" />,
      status: "final",
      content: (
        <div className="space-y-3">
          <p>Enter your credentials in the Configuration tab:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Google Sheets API Key</li>
            <li>Portfolio Spreadsheet ID</li>
            <li>Google Apps Script Web App URL</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Test the connections to verify everything is working correctly.
          </p>
        </div>
      )
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'required': return 'destructive';
      case 'final': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Setup Guide
          </CardTitle>
          <CardDescription>
            Follow these steps to configure your portfolio admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>CORS Issue Fix:</strong> The main cause of authentication errors is missing CORS headers in your Google Apps Script. 
              Make sure to include the CORS headers in ALL response functions in your Apps Script code.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {step.icon}
                      {step.title}
                    </CardTitle>
                    <Badge variant={getStatusColor(step.status)}>
                      {step.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {step.content}
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="mt-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Deployment Issues:</strong> If you can't update your Google Apps Script deployment, 
              create a new deployment with a new URL and update the configuration accordingly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};