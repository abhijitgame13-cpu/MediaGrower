import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Zap, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Settings as SettingsIcon,
  Check,
  X,
  ExternalLink,
  LogOut
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
};

const platformColors = {
  instagram: "text-pink-500",
  facebook: "text-blue-600",
  twitter: "text-blue-400",
  linkedin: "text-blue-700",
};

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    processingUpdates: true,
    postingAlerts: false,
  });

  const [automationSettings, setAutomationSettings] = useState({
    autoEnhancement: true,
    autoCaptions: true,
    autoHashtags: true,
    autoPosting: true,
    optimalTiming: true,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: connections = [], isLoading: connectionsLoading } = useQuery({
    queryKey: ["/api/social-connections"],
    enabled: !!isAuthenticated,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  const connectPlatformMutation = useMutation({
    mutationFn: async ({ platform, isConnected }: { platform: string; isConnected: boolean }) => {
      return await apiRequest('POST', '/api/social-connections', {
        platform,
        isConnected,
        accessToken: isConnected ? 'mock_access_token' : null,
        refreshToken: isConnected ? 'mock_refresh_token' : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-connections'] });
      toast({
        title: "Success",
        description: "Platform connection updated successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update platform connection",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePlatformConnection = (platform: string, currentlyConnected: boolean) => {
    connectPlatformMutation.mutate({
      platform,
      isConnected: !currentlyConnected,
    });
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="p-6 space-y-8" data-testid="settings-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800" data-testid="text-settings-title">
            Settings
          </h1>
          <p className="text-slate-600 mt-1" data-testid="text-settings-subtitle">
            Manage your account, automation preferences, and platform connections
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <Card className="metrics-card" data-testid="card-account-info">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                  data-testid="img-profile-avatar"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-800" data-testid="text-profile-name">
                    {user?.firstName || user?.email || "User"}
                  </p>
                  <p className="text-sm text-slate-500" data-testid="text-profile-email">
                    {user?.email || "user@example.com"}
                  </p>
                  <Badge className="mt-1 bg-secondary text-white" data-testid="badge-plan">
                    Pro Plan
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Enter first name"
                    defaultValue={user?.firstName || ""}
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Enter last name"
                    defaultValue={user?.lastName || ""}
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself..."
                  className="mt-1"
                  data-testid="textarea-bio"
                />
              </div>
              
              <Button className="btn-viralo-primary" data-testid="button-save-profile">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Automation Settings */}
          <Card className="metrics-card" data-testid="card-automation-settings">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Automation Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between" data-testid="setting-auto-enhancement">
                  <div>
                    <p className="font-medium text-slate-800">AI Enhancement</p>
                    <p className="text-sm text-slate-500">Automatically enhance image quality and colors</p>
                  </div>
                  <Switch 
                    checked={automationSettings.autoEnhancement}
                    onCheckedChange={(checked) => 
                      setAutomationSettings(prev => ({ ...prev, autoEnhancement: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between" data-testid="setting-auto-captions">
                  <div>
                    <p className="font-medium text-slate-800">Auto Caption Generation</p>
                    <p className="text-sm text-slate-500">Generate engaging captions using AI</p>
                  </div>
                  <Switch 
                    checked={automationSettings.autoCaptions}
                    onCheckedChange={(checked) => 
                      setAutomationSettings(prev => ({ ...prev, autoCaptions: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between" data-testid="setting-auto-hashtags">
                  <div>
                    <p className="font-medium text-slate-800">Smart Hashtags</p>
                    <p className="text-sm text-slate-500">Automatically add trending hashtags</p>
                  </div>
                  <Switch 
                    checked={automationSettings.autoHashtags}
                    onCheckedChange={(checked) => 
                      setAutomationSettings(prev => ({ ...prev, autoHashtags: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between" data-testid="setting-auto-posting">
                  <div>
                    <p className="font-medium text-slate-800">Automatic Posting</p>
                    <p className="text-sm text-slate-500">Post content to connected platforms automatically</p>
                  </div>
                  <Switch 
                    checked={automationSettings.autoPosting}
                    onCheckedChange={(checked) => 
                      setAutomationSettings(prev => ({ ...prev, autoPosting: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between" data-testid="setting-optimal-timing">
                  <div>
                    <p className="font-medium text-slate-800">Optimal Timing</p>
                    <p className="text-sm text-slate-500">Schedule posts at the best times for engagement</p>
                  </div>
                  <Switch 
                    checked={automationSettings.optimalTiming}
                    onCheckedChange={(checked) => 
                      setAutomationSettings(prev => ({ ...prev, optimalTiming: checked }))
                    }
                  />
                </div>
              </div>
              
              <Button className="btn-viralo-primary" data-testid="button-save-automation">
                Save Automation Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="metrics-card" data-testid="card-notification-settings">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between" data-testid="setting-email-notifications">
                  <div>
                    <p className="font-medium text-slate-800">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between" data-testid="setting-push-notifications">
                  <div>
                    <p className="font-medium text-slate-800">Push Notifications</p>
                    <p className="text-sm text-slate-500">Get real-time browser notifications</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between" data-testid="setting-weekly-reports">
                  <div>
                    <p className="font-medium text-slate-800">Weekly Reports</p>
                    <p className="text-sm text-slate-500">Receive weekly analytics summaries</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between" data-testid="setting-processing-updates">
                  <div>
                    <p className="font-medium text-slate-800">Processing Updates</p>
                    <p className="text-sm text-slate-500">Notifications when content processing completes</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.processingUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, processingUpdates: checked }))
                    }
                  />
                </div>
              </div>
              
              <Button className="btn-viralo-primary" data-testid="button-save-notifications">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Platform Connections */}
          <Card className="metrics-card" data-testid="card-platform-connections">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Platform Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectionsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {['instagram', 'facebook', 'twitter', 'linkedin'].map((platform) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    const colorClass = platformColors[platform as keyof typeof platformColors];
                    const connection = connections.find((c: any) => c.platform === platform);
                    const isConnected = connection?.isConnected || false;
                    
                    return (
                      <div
                        key={platform}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                        data-testid={`platform-connection-${platform}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${colorClass}`} />
                          <div>
                            <p className="font-medium text-slate-800 capitalize">
                              {platform}
                            </p>
                            <p className="text-xs text-slate-500">
                              {isConnected ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant={isConnected ? "outline" : "default"}
                          size="sm"
                          onClick={() => handlePlatformConnection(platform, isConnected)}
                          disabled={connectPlatformMutation.isPending}
                          data-testid={`button-${platform}-connection`}
                        >
                          {isConnected ? (
                            <>
                              <X className="h-3 w-3 mr-1" />
                              Disconnect
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="metrics-card" data-testid="card-account-security">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between" data-testid="security-2fa">
                  <div>
                    <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add extra security to your account</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    data-testid="button-change-password"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    data-testid="button-privacy-settings"
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    data-testid="button-data-export"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Information */}
          <Card className="metrics-card" data-testid="card-plan-info">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <Badge className="bg-secondary text-white text-lg px-4 py-2">
                  Pro Plan
                </Badge>
                <p className="text-sm text-slate-600">
                  Unlimited AI processing, all platforms connected, priority support
                </p>
                <div className="pt-2">
                  <Button variant="outline" className="w-full" data-testid="button-manage-plan">
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
