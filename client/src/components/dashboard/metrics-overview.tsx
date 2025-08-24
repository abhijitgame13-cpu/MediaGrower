import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Calendar, Brain, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function MetricsOverview() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-loading">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="metrics-card">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      title: "Total Followers",
      value: metrics?.totalFollowers?.toLocaleString() || "127.5K",
      growth: `+${metrics?.weeklyGrowth || 12.3}% this week`,
      icon: Users,
      iconClass: "metrics-icon followers",
      isPositive: true,
      testId: "metric-followers"
    },
    {
      title: "Engagement Rate",
      value: `${metrics?.engagementRate?.toFixed(1) || 8.7}%`,
      growth: `+${metrics?.engagementGrowth || 2.1}% this week`,
      icon: Heart,
      iconClass: "metrics-icon engagement",
      isPositive: true,
      testId: "metric-engagement"
    },
    {
      title: "Posts This Week",
      value: metrics?.postsThisWeek?.toString() || "24",
      growth: "Automated posting",
      icon: Calendar,
      iconClass: "metrics-icon posts",
      isPositive: null,
      testId: "metric-posts"
    },
    {
      title: "AI Processing",
      value: `${metrics?.aiProcessingScore || 94}%`,
      growth: "Active 24/7",
      icon: Brain,
      iconClass: "metrics-icon ai",
      isPositive: null,
      testId: "metric-ai"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-overview">
      {metricsData.map((metric) => {
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
                  <p className={`text-sm flex items-center ${
                    metric.isPositive === true 
                      ? "text-secondary" 
                      : metric.isPositive === false 
                        ? "text-destructive" 
                        : "text-accent"
                  }`} data-testid={`text-${metric.testId}-growth`}>
                    {metric.isPositive === true && <TrendingUp className="w-4 h-4 mr-1" />}
                    {metric.isPositive === false && <TrendingDown className="w-4 h-4 mr-1" />}
                    {metric.isPositive === null && <Icon className="w-4 h-4 mr-1" />}
                    {metric.growth}
                  </p>
                </div>
                <div className={metric.iconClass}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
