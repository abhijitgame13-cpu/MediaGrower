import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  Eye, 
  MessageCircle,
  Share2,
  Calendar,
  Download
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("7days");

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

  const { data: analyticsData = [], isLoading: analyticsLoading, error } = useQuery({
    queryKey: ["/api/analytics", timeframe],
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
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    },
  });

  const { data: content = [] } = useQuery({
    queryKey: ["/api/content"],
    enabled: !!isAuthenticated,
  });

  const { data: connections = [] } = useQuery({
    queryKey: ["/api/social-connections"],
    enabled: !!isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate metrics from available data
  const connectedPlatforms = connections.filter((conn: any) => conn.isConnected);
  const totalPosts = content.length;
  const enhancedPosts = content.filter((item: any) => item.status === 'enhanced' || item.status === 'posted').length;
  const postedContent = content.filter((item: any) => item.status === 'posted').length;

  // Mock performance data based on timeframe
  const getPerformanceData = () => {
    const baseMetrics = {
      totalFollowers: 127500,
      weeklyGrowth: 12.3,
      engagementRate: 8.7,
      engagementGrowth: 2.1,
      totalReach: 245600,
      reachGrowth: 18.5,
      totalImpressions: 892000,
      impressionsGrowth: 15.2,
    };

    // Adjust based on timeframe
    const multiplier = timeframe === "30days" ? 3.5 : timeframe === "90days" ? 8.2 : 1;
    
    return {
      ...baseMetrics,
      totalReach: Math.round(baseMetrics.totalReach * multiplier),
      totalImpressions: Math.round(baseMetrics.totalImpressions * multiplier),
    };
  };

  const performanceData = getPerformanceData();

  const keyMetrics = [
    {
      title: "Total Followers",
      value: performanceData.totalFollowers.toLocaleString(),
      growth: `+${performanceData.weeklyGrowth}%`,
      icon: Users,
      iconClass: "metrics-icon followers",
      isPositive: true,
      testId: "metric-total-followers"
    },
    {
      title: "Engagement Rate",
      value: `${performanceData.engagementRate}%`,
      growth: `+${performanceData.engagementGrowth}%`,
      icon: Heart,
      iconClass: "metrics-icon engagement",
      isPositive: true,
      testId: "metric-engagement-rate"
    },
    {
      title: "Total Reach",
      value: performanceData.totalReach.toLocaleString(),
      growth: `+${performanceData.reachGrowth}%`,
      icon: Eye,
      iconClass: "metrics-icon posts",
      isPositive: true,
      testId: "metric-total-reach"
    },
    {
      title: "Impressions",
      value: performanceData.totalImpressions.toLocaleString(),
      growth: `+${performanceData.impressionsGrowth}%`,
      icon: BarChart3,
      iconClass: "metrics-icon ai",
      isPositive: true,
      testId: "metric-impressions"
    },
  ];

  const topPerformingPosts = [
    {
      id: 1,
      title: "Mountain sunset landscape",
      engagement: 847,
      reach: 12400,
      platform: "instagram",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop",
    },
    {
      id: 2,
      title: "Modern workspace setup",
      engagement: 623,
      reach: 9800,
      platform: "facebook",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=60&h=60&fit=crop",
    },
    {
      id: 3,
      title: "Coffee shop morning vibes",
      engagement: 512,
      reach: 8900,
      platform: "twitter",
      thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=60&h=60&fit=crop",
    },
  ];

  return (
    <div className="p-6 space-y-8" data-testid="analytics-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800" data-testid="text-analytics-title">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 mt-1" data-testid="text-analytics-subtitle">
            Track your social media growth and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40" data-testid="select-analytics-timeframe">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" data-testid="button-export-analytics">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="metrics-card">
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          keyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="metrics-card" data-testid={metric.testId}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600" data-testid={`text-${metric.testId}-title`}>
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-800" data-testid={`text-${metric.testId}-value`}>
                        {metric.value}
                      </p>
                      <p className="text-sm flex items-center text-secondary" data-testid={`text-${metric.testId}-growth`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {metric.growth} vs last period
                      </p>
                    </div>
                    <div className={metric.iconClass}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Charts and Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card className="metrics-card" data-testid="card-growth-chart">
          <CardHeader>
            <CardTitle>Growth Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium">Interactive Growth Chart</p>
                <p className="text-sm text-slate-500">Shows follower growth, engagement trends</p>
                <p className="text-xs text-slate-400 mt-2">Chart.js implementation displays here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card className="metrics-card" data-testid="card-platform-performance">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedPlatforms.length === 0 ? (
                <div className="text-center py-8" data-testid="empty-platforms">
                  <Share2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No platforms connected</p>
                  <p className="text-sm text-slate-500">Connect social media accounts to see performance data</p>
                </div>
              ) : (
                connectedPlatforms.map((platform: any) => (
                  <div
                    key={platform.platform}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    data-testid={`platform-performance-${platform.platform}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary capitalize">
                          {platform.platform.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 capitalize" data-testid={`text-platform-${platform.platform}`}>
                          {platform.platform}
                        </p>
                        <p className="text-sm text-slate-500">Active posting</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-secondary" data-testid={`text-engagement-${platform.platform}`}>
                        {Math.floor(Math.random() * 500 + 200)}
                      </p>
                      <p className="text-xs text-slate-500">avg. engagement</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <Card className="metrics-card" data-testid="card-top-posts">
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center space-x-4 p-3 border border-slate-200 rounded-lg card-hover"
                  data-testid={`top-post-${post.id}`}
                >
                  <img 
                    src={post.thumbnail} 
                    alt="Post thumbnail" 
                    className="w-12 h-12 rounded-lg object-cover"
                    data-testid={`img-post-${post.id}`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800" data-testid={`text-post-title-${post.id}`}>
                      {post.title}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span className="flex items-center" data-testid={`text-post-engagement-${post.id}`}>
                        <Heart className="h-3 w-3 mr-1" />
                        {post.engagement}
                      </span>
                      <span className="flex items-center" data-testid={`text-post-reach-${post.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        {post.reach.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="capitalize"
                    data-testid={`badge-platform-${post.id}`}
                  >
                    {post.platform}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="metrics-card" data-testid="card-ai-insights">
          <CardHeader>
            <CardTitle>AI Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200" data-testid="insight-posting-time">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Optimal Posting Time</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Your audience is most active between 2-4 PM on weekdays. Consider scheduling more content during these peak hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200" data-testid="insight-content-performance">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Content Performance</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Landscape photos generate 34% more engagement than other content types. Focus on nature and outdoor scenes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200" data-testid="insight-hashtag-strategy">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Hashtag Strategy</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Using 7-10 hashtags with a mix of popular and niche tags increases reach by 42% on average.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200" data-testid="insight-automation-efficiency">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Automation Efficiency</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      AI automation has saved you an estimated 47 hours this month while increasing engagement by 28%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance Summary */}
      <Card className="metrics-card" data-testid="card-content-summary">
        <CardHeader>
          <CardTitle>Content Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center" data-testid="summary-total-posts">
              <p className="text-3xl font-bold text-slate-800">{totalPosts}</p>
              <p className="text-sm text-slate-600">Total Posts</p>
              <p className="text-xs text-slate-500 mt-1">All time</p>
            </div>
            
            <div className="text-center" data-testid="summary-ai-enhanced">
              <p className="text-3xl font-bold text-secondary">{enhancedPosts}</p>
              <p className="text-sm text-slate-600">AI Enhanced</p>
              <p className="text-xs text-slate-500 mt-1">Ready for posting</p>
            </div>
            
            <div className="text-center" data-testid="summary-posted">
              <p className="text-3xl font-bold text-primary">{postedContent}</p>
              <p className="text-sm text-slate-600">Published</p>
              <p className="text-xs text-slate-500 mt-1">Live on social media</p>
            </div>
            
            <div className="text-center" data-testid="summary-automation-score">
              <p className="text-3xl font-bold text-accent">94%</p>
              <p className="text-sm text-slate-600">Automation Score</p>
              <p className="text-xs text-slate-500 mt-1">Efficiency rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
