import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bug, 
  Network, 
  Terminal, 
  Copy, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

export const DebugConsole = () => {
  const [consoleLog, setConsoleLog] = useState<string[]>([]);
  const [networkLog, setNetworkLog] = useState<any[]>([]);
  const { toast } = useToast();

  // Test Google Sheets API connection
  const testGoogleSheetsConnection = async () => {
    try {
      const config = JSON.parse(localStorage.getItem('admin_config') || '{}');
      const { googleSheetsApiKey, portfolioSpreadsheetId } = config;

      if (!googleSheetsApiKey || !portfolioSpreadsheetId) {
        toast({
          title: "Configuration Missing",
          description: "Please configure Google Sheets API key and Spreadsheet ID in the Config tab",
          variant: "destructive",
        });
        return;
      }

      const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${portfolioSpreadsheetId}/values/Home!A1:B1?key=${googleSheetsApiKey}`;
      
      console.log('Testing Google Sheets connection:', testUrl);
      
      const response = await fetch(testUrl);
      
      if (response.ok) {
        toast({
          title: "Google Sheets Connection ✅",
          description: "Successfully connected to Google Sheets API",
        });
      } else {
        const errorData = await response.json();
        console.error('Google Sheets API Error:', errorData);
        toast({
          title: "Google Sheets Connection ❌",
          description: `Error: ${errorData.error?.message || 'Unknown error'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection test error:', error);
      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  // Test Google Apps Script connection
  const testGoogleAppsScriptConnection = async () => {
    try {
      const config = JSON.parse(localStorage.getItem('admin_config') || '{}');
      const { googleAppsScriptUrl } = config;

      if (!googleAppsScriptUrl) {
        toast({
          title: "Configuration Missing",
          description: "Please configure Google Apps Script URL in the Config tab",
          variant: "destructive",
        });
        return;
      }

      console.log('Testing Google Apps Script connection:', googleAppsScriptUrl);
      
      const response = await fetch(`${googleAppsScriptUrl}?action=ping`, {
        method: 'GET',
      });
      
      if (response.ok) {
        toast({
          title: "Google Apps Script Connection ✅",
          description: "Successfully connected to Google Apps Script",
        });
      } else {
        console.error('Google Apps Script Error:', response.status, response.statusText);
        toast({
          title: "Google Apps Script Connection ❌",
          description: `Error: ${response.status} - ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Apps Script test error:', error);
      toast({
        title: "Apps Script Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Debug information copied successfully",
    });
  };

  const exportDebugInfo = () => {
    const config = localStorage.getItem('admin_config');
    const session = localStorage.getItem('admin_session');
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      config: config ? JSON.parse(config) : null,
      hasSession: !!session,
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorage: {
        adminConfig: !!localStorage.getItem('admin_config'),
        adminSession: !!localStorage.getItem('admin_session'),
      }
    };

    copyToClipboard(JSON.stringify(debugInfo, null, 2));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Debug Console
        </CardTitle>
        <CardDescription>
          Diagnostic tools to help troubleshoot admin panel issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connections" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connections">Connection Tests</TabsTrigger>
            <TabsTrigger value="browser">Browser Debug</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Google Sheets API</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={testGoogleSheetsConnection}
                    className="w-full"
                    variant="outline"
                  >
                    <Network className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Google Apps Script</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={testGoogleAppsScriptConnection}
                    className="w-full"
                    variant="outline"
                  >
                    <Network className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="browser" className="space-y-4">
            <div className="space-y-4">
              <Button onClick={exportDebugInfo} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Export Debug Info
              </Button>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Quick Browser Debug Steps:</h4>
                <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                  <li>Open Browser Developer Tools (F12)</li>
                  <li>Go to <strong>Console</strong> tab to see JavaScript errors</li>
                  <li>Go to <strong>Network</strong> tab to see failed requests</li>
                  <li>Clear console and try logging in again</li>
                  <li>Look for red error messages in Console</li>
                  <li>Look for failed requests (red status) in Network tab</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Common Issues & Solutions</h4>
                    <div className="mt-2 text-sm text-yellow-700 space-y-2">
                      <p><strong>403 Permission Denied:</strong> Your Google Sheets API key doesn't have access to the spreadsheet. Make sure the spreadsheet is publicly viewable or share it with your Google Cloud project.</p>
                      <p><strong>CORS Errors:</strong> Make sure your Google Apps Script includes proper CORS headers in the doGet/doPost functions.</p>
                      <p><strong>Login Fails:</strong> Check that your AdminUsers sheet has the correct username/password and your Google Apps Script URL is correct.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Debugging Steps</h4>
                    <ol className="mt-2 text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Check Configuration tab - ensure all fields are filled</li>
                      <li>Test connections using the Connection Tests above</li>
                      <li>Open browser console (F12) and look for errors</li>
                      <li>Check Google Apps Script Executions tab for backend errors</li>
                      <li>Verify spreadsheet permissions and sheet names</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};