import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertContentSchema, insertSocialConnectionSchema, insertScheduledPostSchema, insertAnalyticsSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Content routes
  app.post('/api/content/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Mock file storage URL (in production, upload to cloud storage)
      const originalUrl = `https://example.com/uploads/${Date.now()}-${file.originalname}`;
      
      const contentType = file.mimetype.startsWith('image/') ? 'image' : 'video';
      
      const contentData = {
        userId,
        filename: file.originalname,
        originalUrl,
        contentType,
        status: 'uploaded' as const,
      };

      const newContent = await storage.createContent(contentData);
      
      // Simulate AI processing workflow
      setTimeout(async () => {
        await storage.updateContent(newContent.id, {
          status: 'processing',
        });
        
        // Mock AI enhancement after 5 seconds
        setTimeout(async () => {
          const enhancedUrl = `https://example.com/enhanced/${Date.now()}-${file.originalname}`;
          const aiCaption = generateMockCaption(file.originalname);
          const aiHashtags = generateMockHashtags(contentType);
          
          await storage.updateContent(newContent.id, {
            status: 'enhanced',
            enhancedUrl,
            aiCaption,
            aiHashtags,
          });
        }, 5000);
      }, 1000);

      res.json(newContent);
    } catch (error) {
      console.error("Error uploading content:", error);
      res.status(500).json({ message: "Failed to upload content" });
    }
  });

  app.get('/api/content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userContent = await storage.getContentByUserId(userId);
      res.json(userContent);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get('/api/content/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const contentItem = await storage.getContentById(id);
      
      if (!contentItem) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(contentItem);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Social connections routes
  app.get('/api/social-connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getSocialConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching social connections:", error);
      res.status(500).json({ message: "Failed to fetch social connections" });
    }
  });

  app.post('/api/social-connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertSocialConnectionSchema.parse({
        ...req.body,
        userId,
      });
      
      const connection = await storage.upsertSocialConnection(validatedData);
      res.json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating social connection:", error);
      res.status(500).json({ message: "Failed to update social connection" });
    }
  });

  // Scheduled posts routes
  app.get('/api/scheduled-posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getScheduledPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      res.status(500).json({ message: "Failed to fetch scheduled posts" });
    }
  });

  app.post('/api/scheduled-posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertScheduledPostSchema.parse({
        ...req.body,
        userId,
      });
      
      const post = await storage.createScheduledPost(validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating scheduled post:", error);
      res.status(500).json({ message: "Failed to create scheduled post" });
    }
  });

  // Analytics routes
  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const analyticsData = await storage.getAnalytics(userId, start, end);
      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAnalyticsSchema.parse({
        ...req.body,
        userId,
      });
      
      const analytics = await storage.upsertAnalytics(validatedData);
      res.json(analytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating analytics:", error);
      res.status(500).json({ message: "Failed to update analytics" });
    }
  });

  // Dashboard metrics endpoint
  app.get('/api/dashboard/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get recent analytics data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      
      const analyticsData = await storage.getAnalytics(userId, startDate, endDate);
      const recentContent = await storage.getContentByUserId(userId);
      const connections = await storage.getSocialConnections(userId);
      
      // Calculate metrics
      const totalFollowers = analyticsData.reduce((sum, record) => sum + record.followers, 0) || 127500;
      const avgEngagementRate = analyticsData.length > 0 
        ? analyticsData.reduce((sum, record) => sum + record.engagementRate, 0) / analyticsData.length / 100
        : 8.7;
      const postsThisWeek = recentContent.filter(content => {
        const contentDate = new Date(content.createdAt!);
        return contentDate >= startDate;
      }).length || 24;
      const aiProcessingScore = 94; // Mock score
      
      const connectedPlatforms = connections.filter(conn => conn.isConnected).length;
      
      res.json({
        totalFollowers,
        engagementRate: avgEngagementRate,
        postsThisWeek,
        aiProcessingScore,
        connectedPlatforms,
        weeklyGrowth: 12.3, // Mock data
        engagementGrowth: 2.1, // Mock data
      });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for mock AI processing
function generateMockCaption(filename: string): string {
  const captions = [
    "Chasing sunsets and mountain peaks 🌄✨ Sometimes the best therapy is a good view and fresh mountain air. Nature never fails to remind us how beautiful life can be! 🏔️",
    "Coffee and creativity fuel my best days ☕️✨ Starting the morning right with intention and inspiration. What's fueling your creative energy today? 💫",
    "Fresh flavors and vibrant colors on the plate today 🥗🌈 Nourishing the body and soul with wholesome goodness. Eating the rainbow never felt so good! 🌟",
    "Modern workspace vibes hitting different today 💻✨ Clean lines, natural light, and endless possibilities. Ready to create something amazing! 🚀",
  ];
  return captions[Math.floor(Math.random() * captions.length)];
}

function generateMockHashtags(contentType: string): string {
  const imageHashtags = "#photography #lifestyle #inspiration #daily #mood #aesthetic #creative #vibes #minimal #art";
  const videoHashtags = "#video #content #storytelling #creative #motion #cinematic #reel #viral #trending #engagement";
  
  return contentType === 'image' ? imageHashtags : videoHashtags;
}
