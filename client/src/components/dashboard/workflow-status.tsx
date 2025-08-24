import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Cog, Clock, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function WorkflowStatus() {
  const { data: content = [] } = useQuery({
    queryKey: ["/api/content"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const workflowSteps = [
    {
      title: "Content Analysis",
      description: `${content.length} files processed`,
      status: "completed",
      icon: Check,
      progress: 100,
      testId: "workflow-analysis"
    },
    {
      title: "AI Enhancement",
      description: "Applying filters, adjusting colors, and optimizing quality",
      status: "active",
      icon: Cog,
      progress: 75,
      testId: "workflow-enhancement"
    },
    {
      title: "Caption & Hashtag Generation",
      description: "Creating trending captions with optimized hashtags",
      status: "pending",
      icon: Clock,
      progress: 0,
      testId: "workflow-captions"
    },
    {
      title: "Auto Publishing",
      description: "Schedule and post to connected platforms",
      status: "pending",
      icon: Share2,
      progress: 0,
      testId: "workflow-publishing"
    },
  ];

  return (
    <Card className="metrics-card" data-testid="card-workflow-status">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Workflow Status</CardTitle>
          <Badge variant="secondary" className="bg-secondary text-white">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            
            return (
              <div
                key={step.title}
                className={`workflow-step ${step.status}`}
                data-testid={step.testId}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    step.status === "completed" 
                      ? "bg-secondary" 
                      : step.status === "active" 
                        ? "bg-primary" 
                        : "bg-slate-300"
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      step.status === "completed" || step.status === "active" 
                        ? "text-white" 
                        : "text-slate-600"
                    } ${step.status === "active" ? "animate-spin" : ""}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800" data-testid={`text-${step.testId}-title`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-600" data-testid={`text-${step.testId}-description`}>
                      {step.description}
                    </p>
                    
                    {step.status === "active" && (
                      <div className="mt-2 space-y-1">
                        <Progress value={step.progress} className="h-2" />
                        <p className="text-xs text-primary font-medium" data-testid={`text-${step.testId}-progress`}>
                          {step.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <span className={`text-sm font-medium ${
                    step.status === "completed" 
                      ? "text-secondary" 
                      : step.status === "active" 
                        ? "text-primary" 
                        : "text-slate-500"
                  }`} data-testid={`text-${step.testId}-status`}>
                    {step.status === "completed" ? "Completed" : 
                     step.status === "active" ? "Processing" : "Queued"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
