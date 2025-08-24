import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FileUpload from "@/components/ui/file-upload";
import { useQuery } from "@tanstack/react-query";
import { FileImage, FileVideo, Check, Clock, Cog } from "lucide-react";
import { format } from "date-fns";

export default function ContentUpload() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: content = [] } = useQuery({
    queryKey: ["/api/content"],
    refetchInterval: 3000, // Refresh every 3 seconds to show processing updates
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Badge variant="secondary">Uploaded</Badge>;
      case 'processing':
        return <Badge className="bg-accent text-accent-foreground">Processing</Badge>;
      case 'enhanced':
        return <Badge className="bg-secondary text-white">Enhanced</Badge>;
      case 'posted':
        return <Badge className="bg-primary text-white">Posted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Clock className="h-4 w-4 text-slate-500" />;
      case 'processing':
        return <Cog className="h-4 w-4 text-accent animate-spin" />;
      case 'enhanced':
      case 'posted':
        return <Check className="h-4 w-4 text-secondary" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="p-6 space-y-8" data-testid="content-upload-page">
      {/* Upload Section */}
      <Card className="metrics-card">
        <CardHeader>
          <CardTitle>Upload Your Content</CardTitle>
          <p className="text-sm text-slate-600">
            Upload images and videos to be processed by our AI for social media optimization
          </p>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

      {/* Content Library */}
      <Card className="metrics-card">
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
          <p className="text-sm text-slate-600">
            Track the status of your uploaded content and AI processing
          </p>
        </CardHeader>
        <CardContent>
          {content.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-state">
              <FileImage className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No content uploaded yet</h3>
              <p className="text-slate-600">
                Upload your first image or video to get started with AI automation
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.map((item: any) => (
                <Card key={item.id} className="card-hover" data-testid={`content-item-${item.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {item.contentType === 'image' ? (
                          <FileImage className="h-8 w-8 text-blue-500" />
                        ) : (
                          <FileVideo className="h-8 w-8 text-purple-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-slate-800 truncate" data-testid={`text-filename-${item.id}`}>
                            {item.filename}
                          </h4>
                          {getStatusIcon(item.status)}
                        </div>
                        
                        <div className="mb-2">
                          {getStatusBadge(item.status)}
                        </div>
                        
                        <p className="text-xs text-slate-500" data-testid={`text-date-${item.id}`}>
                          {format(new Date(item.createdAt), 'MMM d, yyyy at h:mm a')}
                        </p>
                        
                        {item.aiCaption && (
                          <div className="mt-3 p-2 bg-green-50 rounded text-xs" data-testid={`section-caption-${item.id}`}>
                            <p className="font-medium text-slate-700 mb-1">AI Caption:</p>
                            <p className="text-slate-600 italic line-clamp-2">
                              {item.aiCaption.substring(0, 100)}...
                            </p>
                          </div>
                        )}
                        
                        {item.aiHashtags && (
                          <div className="mt-2" data-testid={`section-hashtags-${item.id}`}>
                            <p className="text-xs text-slate-500">
                              {item.aiHashtags.split(' ').slice(0, 3).join(' ')}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
