import { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory store for demonstration
// In production, you'd want to use a proper database
const violationReports: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Get the CSP report from the request body
      const report = req.body['csp-report'];
      
      if (report) {
        console.log('CSP Violation:', report);
        violationReports.push({
          ...report,
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent']
        });
      }
      
      return res.status(204).end(); // 204 No Content
    } catch (error) {
      console.error('Error processing CSP report:', error);
      return res.status(400).json({ error: 'Invalid CSP report' });
    }
  }

  if (req.method === 'GET') {
    // In a real app, you'd want proper authentication here
    return res.status(200).json({ violations: violationReports });
  }

  return res.status(405).end(); // Method Not Allowed
}
