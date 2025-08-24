import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

const mockUpcomingPosts = [
  {
    id: 1,
    title: "Coffee shop vibes",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    schedule: "Today at 2:00 PM",
    platforms: ["instagram", "facebook"],
  },
  {
    id: 2,
    title: "Healthy lunch prep",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    schedule: "Today at 7:00 PM",
    platforms: ["instagram", "twitter"],
  },
  {
    id: 3,
    title: "Workspace inspiration",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    schedule: "Tomorrow at 9:00 AM",
    platforms: ["facebook", "twitter"],
  },
];

export default function PostingSchedule() {
  const { data: connections = [] } = useQuery({
    queryKey: ["/api/social-connections"],
  });

  const { data: scheduledPosts = [] } = useQuery({
    queryKey: ["/api/scheduled-posts"],
  });

  const connectedPlatforms = connections.filter((conn: any) => conn.isConnected);

  return (
    <Card className="metrics-card" data-testid="card-posting-schedule">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Automated Posting Schedule</CardTitle>
          <Badge variant="secondary" className="bg-secondary text-white">
            24/7 Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Optimal Posting Times */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-3" data-testid="text-optimal-times">
            AI-Optimized Posting Times
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg" data-testid="times-instagram">
              <p className="text-sm font-medium text-slate-800">Instagram</p>
              <p className="text-xs text-slate-600">9:00 AM, 2:00 PM, 7:00 PM</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg" data-testid="times-facebook">
              <p className="text-sm font-medium text-slate-800">Facebook</p>
              <p className="text-xs text-slate-600">11:00 AM, 3:00 PM, 8:00 PM</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg" data-testid="times-twitter">
              <p className="text-sm font-medium text-slate-800">Twitter</p>
              <p className="text-xs text-slate-600">8:00 AM, 12:00 PM, 6:00 PM</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg" data-testid="times-linkedin">
              <p className="text-sm font-medium text-slate-800">LinkedIn</p>
              <p className="text-xs text-red-600">Disconnected</p>
            </div>
          </div>
        </div>

        {/* Upcoming Posts */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3" data-testid="text-upcoming-posts">
            Upcoming Posts
          </h4>
          <div className="space-y-3">
            {mockUpcomingPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg card-hover"
                data-testid={`post-${post.id}`}
              >
                <img 
                  src={post.thumbnail} 
                  alt="Scheduled post thumbnail" 
                  className="w-10 h-10 rounded object-cover"
                  data-testid={`img-post-${post.id}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800" data-testid={`text-title-${post.id}`}>
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-500" data-testid={`text-schedule-${post.id}`}>
                    {post.schedule}
                  </p>
                </div>
                <div className="flex space-x-1" data-testid={`platforms-${post.id}`}>
                  {post.platforms.map((platform) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    const colorClass = platformColors[platform as keyof typeof platformColors];
                    return (
                      <Icon 
                        key={platform} 
                        className={`h-4 w-4 ${colorClass}`}
                        data-testid={`icon-${platform}-${post.id}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
