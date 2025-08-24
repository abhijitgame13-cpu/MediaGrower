import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function GrowthAnalytics() {
  const { data: analytics = [] } = useQuery({
    queryKey: ["/api/analytics"],
  });

  return (
    <Card className="metrics-card" data-testid="card-growth-analytics">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Growth Analytics</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-32" data-testid="select-timeframe">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Placeholder */}
          <div className="chart-container h-64 flex items-center justify-center" data-testid="chart-placeholder">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium">Interactive Analytics Chart</p>
              <p className="text-sm text-slate-500">Chart.js implementation</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200" data-testid="metric-best-post">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Best Performing Post</p>
                  <p className="font-semibold text-slate-800" data-testid="text-best-post">
                    Mountain sunset photo
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-secondary" data-testid="text-best-engagement">
                    847
                  </p>
                  <p className="text-xs text-slate-500">engagements</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200" data-testid="metric-daily-reach">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg. Daily Reach</p>
                  <p className="font-semibold text-slate-800" data-testid="text-daily-reach">
                    12.4K
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary flex items-center" data-testid="text-reach-growth">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +18%
                  </p>
                  <p className="text-xs text-slate-500">vs last week</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200" data-testid="metric-optimization">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">AI Optimization Score</p>
                  <p className="font-semibold text-slate-800" data-testid="text-optimization-score">
                    94/100
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600" data-testid="text-time-saved">
                    47h
                  </p>
                  <p className="text-xs text-slate-500">time saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
