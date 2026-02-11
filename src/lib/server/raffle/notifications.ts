/**
 * Email notification stubs.
 * In production, integrate with SendGrid, Resend, or similar.
 */

interface WinnerNotification {
	email: string;
	dropTitle: string;
	purchaseUrl: string;
	expiresAt: Date;
}

interface LoserNotification {
	email: string;
	dropTitle: string;
	waitlistPosition?: number;
}

export async function sendWinnerNotification(notification: WinnerNotification): Promise<void> {
	// TODO: Integrate with email provider
	console.warn('[Raffle] Winner notification (stub):', {
		to: notification.email,
		subject: `You won! ${notification.dropTitle}`,
		purchaseUrl: notification.purchaseUrl,
		expiresAt: notification.expiresAt.toISOString(),
	});
}

export async function sendLoserNotification(notification: LoserNotification): Promise<void> {
	// TODO: Integrate with email provider
	console.warn('[Raffle] Loser notification (stub):', {
		to: notification.email,
		subject: `${notification.dropTitle} - Raffle Results`,
		waitlistPosition: notification.waitlistPosition,
	});
}

export async function sendBulkWinnerNotifications(
	notifications: WinnerNotification[],
): Promise<{ sent: number; failed: number }> {
	let sent = 0;
	let failed = 0;

	for (const notification of notifications) {
		try {
			await sendWinnerNotification(notification);
			sent++;
		} catch {
			failed++;
		}
	}

	return { sent, failed };
}

export async function sendBulkLoserNotifications(
	notifications: LoserNotification[],
): Promise<{ sent: number; failed: number }> {
	let sent = 0;
	let failed = 0;

	for (const notification of notifications) {
		try {
			await sendLoserNotification(notification);
			sent++;
		} catch {
			failed++;
		}
	}

	return { sent, failed };
}
