import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Image, Wand2, MessageSquare, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AiProcessing() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: content = [] } = useQuery({
    queryKey: ["/api/content"],
    refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate processing statistics
  const totalContent = content.length;
  const uploadedContent = content.filter((item: any) => item.status === 'uploaded').length;
  const processingContent = content.filter((item: any) => item.status === 'processing').length;
  const enhancedContent = content.filter((item: any) => item.status === 'enhanced').length;
  const postedContent = content.filter((item: any) => item.status === 'posted').length;

  const processingSteps = [
    {
      title: "Content Analysis",
      description: "Analyzing uploaded content for optimization opportunities",
      icon: Image,
      completed: totalContent,
      total: totalContent,
      color: "bg-blue-500",
    },
    {
      title: "AI Enhancement",
      description: "Applying filters, color correction, and quality improvements",
      icon: Wand2,
      completed: enhancedContent + postedContent,
      total: totalContent,
      color: "bg-purple-500",
    },
    {
      title: "Caption Generation",
      description: "Creating engaging captions with trending keywords",
      icon: MessageSquare,
      completed: enhancedContent + postedContent,
      total: totalContent,
      color: "bg-green-500",
    },
    {
      title: "Auto Publishing",
      description: "Scheduling and posting to connected social platforms",
      icon: Share2,
      completed: postedContent,
      total: totalContent,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="p-6 space-y-8" data-testid="ai-processing-page">
      {/* Processing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metrics-card" data-testid="stat-uploaded">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Uploaded</p>
                <p className="text-2xl font-bold text-slate-800" data-testid="count-uploaded">
                  {uploadedContent}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metrics-card" data-testid="stat-processing">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Processing</p>
                <p className="text-2xl font-bold text-slate-800" data-testid="count-processing">
                  {processingContent}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-accent animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metrics-card" data-testid="stat-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Enhanced</p>
                <p className="text-2xl font-bold text-slate-800" data-testid="count-enhanced">
                  {enhancedContent}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Wand2 className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metrics-card" data-testid="stat-posted">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Posted</p>
                <p className="text-2xl font-bold text-slate-800" data-testid="count-posted">
                  {postedContent}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Processing Pipeline */}
      <Card className="metrics-card" data-testid="card-processing-pipeline">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Brain className="h-6 w-6 mr-2 text-primary" />
              AI Processing Pipeline
            </CardTitle>
            <Badge variant="secondary" className="bg-secondary text-white">
              24/7 Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {processingSteps.map((step, index) => {
              const Icon = step.icon;
              const progressPercentage = step.total > 0 ? (step.completed / step.total) * 100 : 0;
              const isActive = step.completed < step.total;
              
              return (
                <div key={step.title} className="space-y-3" data-testid={`pipeline-step-${index}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 text-white ${isActive ? 'animate-pulse' : ''}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800" data-testid={`text-step-title-${index}`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-600" data-testid={`text-step-description-${index}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-800" data-testid={`text-step-progress-${index}`}>
                        {step.completed}/{step.total}
                      </p>
                      <p className="text-xs text-slate-500" data-testid={`text-step-percentage-${index}`}>
                        {progressPercentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2" 
                    data-testid={`progress-step-${index}`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Processing Activity */}
      <Card className="metrics-card" data-testid="card-recent-activity">
        <CardHeader>
          <CardTitle>Recent Processing Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {content.length === 0 ? (
            <div className="text-center py-8" data-testid="empty-activity">
              <Brain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No content to process</h3>
              <p className="text-slate-600">Upload some content to see AI processing in action</p>
            </div>
          ) : (
            <div className="space-y-3">
              {content.slice(0, 5).map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                  data-testid={`activity-item-${item.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'processing' 
                        ? 'bg-accent/20' 
                        : item.status === 'enhanced' 
                          ? 'bg-secondary/20' 
                          : 'bg-slate-200'
                    }`}>
                      <Brain className={`h-4 w-4 ${
                        item.status === 'processing' 
                          ? 'text-accent animate-spin' 
                          : item.status === 'enhanced' 
                            ? 'text-secondary' 
                            : 'text-slate-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800" data-testid={`text-activity-filename-${item.id}`}>
                        {item.filename}
                      </p>
                      <p className="text-xs text-slate-500" data-testid={`text-activity-status-${item.id}`}>
                        {item.status === 'processing' && 'AI enhancement in progress...'}
                        {item.status === 'enhanced' && 'Processing complete - ready for posting'}
                        {item.status === 'uploaded' && 'Queued for processing'}
                        {item.status === 'posted' && 'Posted to social media'}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={item.status === 'enhanced' ? 'default' : 'secondary'}
                    data-testid={`badge-activity-${item.id}`}
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
