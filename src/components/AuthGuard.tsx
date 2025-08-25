import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { googleAppsScriptAuth } from '@/lib/googleAppsScriptAuth';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfigMode, setShowConfigMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authToken = localStorage.getItem('admin_auth_token');
    const expiry = localStorage.getItem('admin_auth_expiry');
    
    // Check if Google Apps Script URL is configured
    const config = localStorage.getItem('admin_config');
    let hasConfig = false;
    
    try {
      if (config) {
        const parsedConfig = JSON.parse(config);
        hasConfig = Boolean(parsedConfig?.googleAppsScriptUrl);
        console.log('Auth check - Config status:', { hasConfig, scriptUrl: parsedConfig?.googleAppsScriptUrl });
      }
    } catch (error) {
      console.error('Error parsing config in auth check:', error);
    }
    
    if (authToken && expiry && new Date().getTime() < parseInt(expiry)) {
      setIsAuthenticated(true);
    } else if (!hasConfig) {
      // If no config exists, show config mode instead of login
      setShowConfigMode(true);
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await googleAppsScriptAuth.authenticate(
        credentials.username, 
        credentials.password
      );

      if (result.success) {
        // Store auth token with 2-hour expiry
        const expiry = new Date().getTime() + (2 * 60 * 60 * 1000);
        localStorage.setItem('admin_auth_token', result.token);
        localStorage.setItem('admin_auth_expiry', expiry.toString());
        localStorage.setItem('admin_user', credentials.username);
        
        setIsAuthenticated(true);
        toast({
          title: "Authentication successful",
          description: "Welcome to the admin panel",
        });
      } else {
        throw new Error(result.message || 'Authentication failed');
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_auth_expiry');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  // Show configuration mode if no config exists
  if (showConfigMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Initial Setup Required</CardTitle>
                <CardDescription>
                  Please configure your Google Apps Script URL to enable authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Admin Authentication</CardTitle>
            <CardDescription>
              Please enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !credentials.username || !credentials.password}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                size="sm"
                onClick={() => setShowConfigMode(true)}
              >
                Need to configure settings first?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <Lock className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );
};