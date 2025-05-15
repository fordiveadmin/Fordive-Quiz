import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';

// Default admin password
const DEFAULT_PASSWORD = "fordive123";
let adminPassword = DEFAULT_PASSWORD;

export function setupAdminAuth(app: Express) {
  const MemStoreSession = MemoryStore(session);
  
  // Set up session middleware
  app.use(
    session({
      secret: 'fordive-admin-secret-key',
      resave: false,
      saveUninitialized: false,
      store: new MemStoreSession({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      cookie: { 
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
        secure: process.env.NODE_ENV === 'production'
      }
    })
  );
  
  // Admin login endpoint
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    
    if (password === adminPassword) {
      (req.session as any).isAdminAuthenticated = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Password salah. Silakan coba lagi." 
      });
    }
  });
  
  // Admin logout endpoint
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Gagal logout. Silakan coba lagi." 
        });
      }
      
      res.json({ success: true });
    });
  });
  
  // Change admin password endpoint
  app.post('/api/admin/change-password', adminAuthMiddleware, (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    
    if (currentPassword !== adminPassword) {
      return res.status(401).json({ 
        success: false, 
        message: "Password saat ini salah." 
      });
    }
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password baru harus minimal 6 karakter."
      });
    }
    
    // Update password
    adminPassword = newPassword;
    
    res.json({ 
      success: true,
      message: "Password berhasil diubah."
    });
  });
  
  // Check admin authentication status
  app.get('/api/admin/auth-status', (req: Request, res: Response) => {
    res.json({
      isAuthenticated: (req.session as any).isAdminAuthenticated === true
    });
  });
}

// Middleware to protect admin routes
export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).isAdminAuthenticated) {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Anda perlu login terlebih dahulu." 
    });
  }
}