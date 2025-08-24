import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function EnhancementPreview() {
  const { data: content = [] } = useQuery({
    queryKey: ["/api/content"],
  });

  // Get the most recent enhanced content for preview
  const enhancedContent = content.find((item: any) => item.status === 'enhanced');

  return (
    <Card className="metrics-card" data-testid="card-enhancement-preview">
      <CardHeader>
        <CardTitle>AI Enhancement Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="enhancement-comparison">
          {/* Before */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2" data-testid="text-before-label">
              Before
            </h4>
            <div className="enhancement-before">
              <img 
                src="https://pixabay.com/get/g39dcbc1df6216c1205f9581354bac2b64c919559917cc826a1ab0cecf5c68ac1a3633a98aa5639f4245f2b82bebc6c107fde8e0c6c7f9ceed8f2ab208a07c141_1280.jpg" 
                alt="Original unprocessed image" 
                className="w-full h-48 object-cover rounded-lg border-2 border-slate-200"
                data-testid="img-before"
              />
            </div>
          </div>
          
          {/* After */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2" data-testid="text-after-label">
              After AI Enhancement
            </h4>
            <div className="enhancement-after">
              <img 
                src={enhancedContent?.enhancedUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
                alt="AI enhanced image with better colors and lighting" 
                className="w-full h-48 object-cover rounded-lg border-2 border-primary"
                data-testid="img-after"
              />
            </div>
          </div>
        </div>

        {/* Enhancement Details */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-testid="section-enhancements">
          <h5 className="text-sm font-semibold text-slate-800 mb-2">AI Enhancements Applied:</h5>
          <ul className="text-sm text-slate-600 space-y-1">
            <li className="flex items-center" data-testid="enhancement-brightness">
              <Check className="h-4 w-4 text-secondary mr-2" />
              Enhanced brightness by 15%
            </li>
            <li className="flex items-center" data-testid="enhancement-contrast">
              <Check className="h-4 w-4 text-secondary mr-2" />
              Improved contrast and saturation
            </li>
            <li className="flex items-center" data-testid="enhancement-grading">
              <Check className="h-4 w-4 text-secondary mr-2" />
              Applied cinematic color grading
            </li>
            <li className="flex items-center" data-testid="enhancement-optimization">
              <Check className="h-4 w-4 text-secondary mr-2" />
              Optimized for social media dimensions
            </li>
          </ul>
        </div>

        {/* Generated Caption */}
        <div className="mt-4 p-4 bg-green-50 rounded-lg" data-testid="section-caption">
          <h5 className="text-sm font-semibold text-slate-800 mb-2">AI Generated Caption:</h5>
          <p className="text-sm text-slate-700 italic" data-testid="text-ai-caption">
            {enhancedContent?.aiCaption || 
            "\"Chasing sunsets and mountain peaks 🌄✨ Sometimes the best therapy is a good view and fresh mountain air. Nature never fails to remind us how beautiful life can be! 🏔️\""}
          </p>
          <p className="text-xs text-slate-500 mt-2" data-testid="text-ai-hashtags">
            {enhancedContent?.aiHashtags || 
            "#mountains #sunset #nature #travel #hiking #adventure #landscape #peace #mindfulness #outdoor"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
