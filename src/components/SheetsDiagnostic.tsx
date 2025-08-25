import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Database, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface SheetInfo {
  name: string;
  status: 'success' | 'error' | 'testing';
  error?: string;
  rowCount?: number;
}

export const SheetsDiagnostic = () => {
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const saved = localStorage.getItem('admin_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  };

  const testSheet = async (sheetName: string): Promise<SheetInfo> => {
    if (!config?.googleSheetsApiKey || !config?.portfolioSpreadsheetId) {
      return {
        name: sheetName,
        status: 'error',
        error: 'API key or Spreadsheet ID not configured'
      };
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${config.portfolioSpreadsheetId}/values/${sheetName}!A1:Z1000?key=${config.googleSheetsApiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        return {
          name: sheetName,
          status: 'success',
          rowCount: data.values?.length || 0
        };
      } else {
        const errorData = await response.json();
        return {
          name: sheetName,
          status: 'error',
          error: errorData.error?.message || 'Unknown error'
        };
      }
    } catch (error) {
      return {
        name: sheetName,
        status: 'error',
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  };

  const runDiagnostic = async () => {
    if (!config) {
      toast({
        title: "Configuration missing",
        description: "Please configure your credentials first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const expectedSheets = [
      'Home',
      'Portfolio', 
      'Skills',
      'Certificates',
      'Blog',
      'Contact',
      'Experience',
      'Education'
    ];

    // Test each sheet
    const results: SheetInfo[] = [];
    for (const sheetName of expectedSheets) {
      setSheets(prev => [...prev.filter(s => s.name !== sheetName), {
        name: sheetName,
        status: 'testing' as const
      }]);
      
      const result = await testSheet(sheetName);
      results.push(result);
      
      setSheets(prev => [...prev.filter(s => s.name !== sheetName), result]);
    }

    setIsLoading(false);
    
    const successCount = results.filter(s => s.status === 'success').length;
    const errorCount = results.filter(s => s.status === 'error').length;
    
    toast({
      title: "Diagnostic complete",
      description: `${successCount} sheets found, ${errorCount} errors`,
      variant: successCount > 0 ? "default" : "destructive",
    });
  };

  const discoverSheets = async () => {
    if (!config?.googleSheetsApiKey || !config?.portfolioSpreadsheetId) {
      toast({
        title: "Configuration missing",
        description: "Please configure your credentials first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get spreadsheet metadata to discover sheet names
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${config.portfolioSpreadsheetId}?key=${config.googleSheetsApiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        const sheetNames = data.sheets?.map((sheet: any) => sheet.properties.title) || [];
        
        toast({
          title: "Sheets discovered",
          description: `Found ${sheetNames.length} sheets: ${sheetNames.join(', ')}`,
        });

        // Test each discovered sheet
        const results: SheetInfo[] = [];
        for (const sheetName of sheetNames) {
          const result = await testSheet(sheetName);
          results.push(result);
        }
        
        setSheets(results);
      } else {
        const errorData = await response.json();
        toast({
          title: "Discovery failed",
          description: errorData.error?.message || "Failed to discover sheets",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Discovery error",
        description: error instanceof Error ? error.message : "Network error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Google Sheets Diagnostic
          </CardTitle>
          <CardDescription>
            Test connection to your Google Sheets and identify sheet names
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!config && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please configure your API credentials in the Configuration tab first.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={runDiagnostic} 
              disabled={isLoading || !config}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Test Expected Sheets
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={discoverSheets} 
              disabled={isLoading || !config}
            >
              Discover All Sheets
            </Button>
          </div>

          {sheets.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Sheet Status:</h3>
              <div className="grid gap-2">
                {sheets.map((sheet) => (
                  <div key={sheet.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(sheet.status)}
                      <div>
                        <p className="font-medium">{sheet.name}</p>
                        {sheet.status === 'success' && sheet.rowCount !== undefined && (
                          <p className="text-sm text-muted-foreground">
                            {sheet.rowCount} rows
                          </p>
                        )}
                        {sheet.error && (
                          <p className="text-sm text-red-500">{sheet.error}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={sheet.status === 'success' ? 'default' : sheet.status === 'error' ? 'destructive' : 'secondary'}>
                      {sheet.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};