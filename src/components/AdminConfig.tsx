import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings, Key, Database, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Extend window interface for global functions
declare global {
  interface Window {
    updateGoogleSheetsConfig?: (apiKey: string, spreadsheetId: string) => void;
    updateGoogleAppsScriptConfig?: (scriptUrl: string) => void;
  }
}

interface ConfigData {
  googleSheetsApiKey: string;
  portfolioSpreadsheetId: string;
  adminSpreadsheetId: string;
  googleAppsScriptUrl: string;
}

export const AdminConfig = () => {
  const [config, setConfig] = useState<ConfigData>({
    googleSheetsApiKey: '',
    portfolioSpreadsheetId: '',
    adminSpreadsheetId: '',
    googleAppsScriptUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    sheets: 'pending' | 'success' | 'error';
    script: 'pending' | 'success' | 'error';
  }>({
    sheets: 'pending',
    script: 'pending'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const saved = localStorage.getItem('admin_config');
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  };

  const saveConfig = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('admin_config', JSON.stringify(config));
      
      // Update the global services with new config
      updateServiceConfig();
      
      toast({
        title: "Configuration saved",
        description: "Settings saved successfully. Testing connections...",
      });
      
      // Test connections
      testConnections();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Error saving configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateServiceConfig = () => {
    // Update googleSheetsService configuration
    if (window.updateGoogleSheetsConfig) {
      window.updateGoogleSheetsConfig(config.googleSheetsApiKey, config.portfolioSpreadsheetId);
    }
    
    // Update googleAppsScriptAuth configuration
    if (window.updateGoogleAppsScriptConfig) {
      window.updateGoogleAppsScriptConfig(config.googleAppsScriptUrl);
    }
  };

  const testConnections = async () => {
    setConnectionStatus({ sheets: 'pending', script: 'pending' });
    
    // Test Google Sheets API
    try {
      if (config.googleSheetsApiKey && config.portfolioSpreadsheetId) {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${config.portfolioSpreadsheetId}/values/A1:A1?key=${config.googleSheetsApiKey}`
        );
        setConnectionStatus(prev => ({ 
          ...prev, 
          sheets: response.ok ? 'success' : 'error' 
        }));
      }
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, sheets: 'error' }));
    }

    // Test Google Apps Script
    try {
      if (config.googleAppsScriptUrl) {
        const response = await fetch(`${config.googleAppsScriptUrl}?action=ping`, {
          method: 'GET',
          mode: 'cors'
        });
        setConnectionStatus(prev => ({ 
          ...prev, 
          script: response.ok ? 'success' : 'error' 
        }));
      }
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, script: 'error' }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-yellow-500 rounded-full animate-pulse" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Configuration
          </CardTitle>
          <CardDescription>
            Configure your Google API credentials and service endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This configuration is stored locally in your browser. 
              For security, actual API keys should be managed through environment variables in production.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="credentials" className="space-y-4">
            <TabsList>
              <TabsTrigger value="credentials">API Credentials</TabsTrigger>
              <TabsTrigger value="endpoints">Service Endpoints</TabsTrigger>
              <TabsTrigger value="status">Connection Status</TabsTrigger>
            </TabsList>

            <TabsContent value="credentials" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sheetsKey">Google Sheets API Key</Label>
                  <Input
                    id="sheetsKey"
                    type="password"
                    value={config.googleSheetsApiKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, googleSheetsApiKey: e.target.value }))}
                    placeholder="AIzaSy..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Get this from Google Cloud Console → APIs & Services → Credentials
                  </p>
                </div>

                <div>
                  <Label htmlFor="portfolioId">Portfolio Spreadsheet ID</Label>
                  <Input
                    id="portfolioId"
                    value={config.portfolioSpreadsheetId}
                    onChange={(e) => setConfig(prev => ({ ...prev, portfolioSpreadsheetId: e.target.value }))}
                    placeholder="1ABC123..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Found in the Google Sheets URL: /spreadsheets/d/[SPREADSHEET_ID]/
                  </p>
                </div>

                <div>
                  <Label htmlFor="adminId">Admin Spreadsheet ID</Label>
                  <Input
                    id="adminId"
                    value={config.adminSpreadsheetId}
                    onChange={(e) => setConfig(prev => ({ ...prev, adminSpreadsheetId: e.target.value }))}
                    placeholder="1XYZ789..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Spreadsheet for admin data, audit logs, and settings
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-4">
              <div>
                <Label htmlFor="scriptUrl">Google Apps Script Web App URL</Label>
                <Input
                  id="scriptUrl"
                  value={config.googleAppsScriptUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, googleAppsScriptUrl: e.target.value }))}
                  placeholder="https://script.google.com/macros/s/..."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Deploy your Apps Script as a Web App and copy the URL here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="status" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Google Sheets API</p>
                      <p className="text-sm text-muted-foreground">Portfolio data access</p>
                    </div>
                  </div>
                  {getStatusIcon(connectionStatus.sheets)}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Google Apps Script</p>
                      <p className="text-sm text-muted-foreground">Backend authentication</p>
                    </div>
                  </div>
                  {getStatusIcon(connectionStatus.script)}
                </div>
              </div>

              <Button onClick={testConnections} variant="outline" className="w-full">
                Test Connections
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button onClick={saveConfig} disabled={isSaving}>
              <Key className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};