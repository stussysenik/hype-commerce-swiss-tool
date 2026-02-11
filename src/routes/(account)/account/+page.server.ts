import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	// In production: fetch user data from session
	return {
		user: null as {
			email: string;
			displayName: string | null;
			tier: 'standard' | 'vip' | 'platinum';
			totalDropsEntered: number;
			totalDropsWon: number;
		} | null,
		dropEntries: [] as {
			dropTitle: string;
			status: string;
			createdAt: string;
		}[],
		wishlistItems: [] as {
			shopifyProductId: string;
			productTitle: string | null;
			productImage: string | null;
			productHandle: string | null;
		}[],
	};
};
