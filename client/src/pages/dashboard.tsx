import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import MetricsOverview from "@/components/dashboard/metrics-overview";
import WorkflowStatus from "@/components/dashboard/workflow-status";
import EnhancementPreview from "@/components/dashboard/enhancement-preview";
import PostingSchedule from "@/components/dashboard/posting-schedule";
import GrowthAnalytics from "@/components/dashboard/growth-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/ui/file-upload";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  return (
    <div className="p-3 lg:p-6 space-y-4 lg:space-y-8" data-testid="dashboard">
      {/* Metrics Overview */}
      <MetricsOverview />

      {/* Main Content Grid */}
      <div className="mobile-grid lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* AI Workflow Status */}
        <div className="lg:col-span-2">
          <WorkflowStatus />
        </div>

        {/* Content Upload Zone */}
        <Card className="metrics-card" data-testid="card-upload">
          <CardHeader>
            <CardTitle className="mobile-text lg:text-base">Quick Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload />
          </CardContent>
        </Card>
      </div>

      {/* AI Enhancement Preview & Posting Schedule */}
      <div className="mobile-grid xl:grid xl:grid-cols-2 gap-4 lg:gap-6">
        <EnhancementPreview />
        <PostingSchedule />
      </div>

      {/* Growth Analytics */}
      <GrowthAnalytics />
    </div>
  );
}
