import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Rocket, Brain, Calendar, TrendingUp, Zap, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 viralo-gradient rounded-2xl flex items-center justify-center viralo-glow">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800">Viralo</h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            AI-Powered Social Media Automation
          </h2>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Transform your social media presence with our 24/7 AI automation platform. 
            Upload your content and let our AI handle editing, captions, hashtags, and posting 
            to grow your accounts while you sleep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="btn-viralo-primary text-lg px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              Start Growing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-sm text-slate-500">
              Free trial • No credit card required
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">AI Content Enhancement</h3>
              <p className="text-slate-600">
                Advanced AI automatically enhances your photos and videos with professional-grade filters, 
                color correction, and optimization for maximum engagement.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Smart Captions & Hashtags</h3>
              <p className="text-slate-600">
                Generate viral captions and trending hashtags powered by real-time social media 
                analytics to maximize your reach and engagement.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">24/7 Automated Posting</h3>
              <p className="text-slate-600">
                Schedule and post content at optimal times across all your social platforms 
                automatically, ensuring consistent growth around the clock.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Growth Analytics</h3>
              <p className="text-slate-600">
                Track your follower growth, engagement rates, and performance metrics with 
                detailed analytics to optimize your social media strategy.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Multi-Platform Support</h3>
              <p className="text-slate-600">
                Connect and manage Instagram, Facebook, Twitter, LinkedIn, and more from a 
                single unified dashboard with secure API integrations.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Set & Forget</h3>
              <p className="text-slate-600">
                Simply upload your content and let Viralo handle everything else. Our AI works 
                continuously to grow your social media presence while you focus on your business.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-12">How Viralo Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 viralo-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload Content</h3>
              <p className="text-slate-600">
                Drag and drop your photos and videos into organized folders
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 viralo-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Enhancement</h3>
              <p className="text-slate-600">
                Our AI automatically enhances and optimizes your content
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 viralo-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Captions</h3>
              <p className="text-slate-600">
                Generate trending captions and hashtags for maximum reach
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 viralo-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Auto Posting</h3>
              <p className="text-slate-600">
                Automatically post to all your social platforms 24/7
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Ready to Automate Your Social Media Growth?
          </h2>
          
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of creators and businesses who trust Viralo to grow their social media presence.
          </p>
          
          <Button 
            size="lg" 
            className="btn-viralo-primary text-lg px-12 py-4"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-cta-login"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="text-sm text-slate-500 mt-4">
            No setup fees • Cancel anytime • 14-day free trial
          </p>
        </div>
      </div>
    </div>
  );
}
