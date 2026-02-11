import { router } from './init.js';
import { dropsRouter } from './routers/drops.js';
import { userRouter } from './routers/user.js';
import { analyticsRouter } from './routers/analytics.js';

export const appRouter = router({
	drops: dropsRouter,
	user: userRouter,
	analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
