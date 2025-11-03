import { Request, Response, NextFunction } from 'express';

// In-memory store for CSP violation reports (in production, use a database)
const cspViolations: any[] = [];

// Middleware to handle CSP violation reports
export const handleCspReport = (req: Request, res: Response, next: NextFunction) => {
  // Only handle POST requests to the reporting endpoint
  if (req.method === 'POST' && req.path === '/api/csp-report') {
    try {
      const report = req.body['csp-report'] || req.body;
      
      if (report) {
        console.log('CSP Violation:', JSON.stringify(report, null, 2));
        cspViolations.push({
          ...report,
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent'],
          ip: req.ip
        });
      }
      
      return res.status(204).end(); // 204 No Content
    } catch (error) {
      console.error('Error processing CSP report:', error);
      return res.status(400).json({ error: 'Invalid CSP report' });
    }
  }
  
  next();
};

// Route to view CSP violations (protected in production)
export const getCspViolations = (req: Request, res: Response) => {
  // In production, add authentication here
  return res.status(200).json({ violations: cspViolations });
};
