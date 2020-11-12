import { Router, Request, Response } from 'express';

const router = Router();
router.get('/ping', (req: Request, res: Response) => {
  res.send({ response: 'I am alive' }).status(200);
});

export default router;
