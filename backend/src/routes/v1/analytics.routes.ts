import { Router, Request, Response } from 'express';

const router = Router();

// Accept analytics events silently - just acknowledge
router.post('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Event tracked' });
});

export default router;
