import { randomBytes, createHmac } from 'crypto';
import { env } from '$env/dynamic/private';

const SESSION_EXPIRY_MINUTES = 15;

interface SessionPayload {
	userId: string;
	expiresAt: number;
}

/**
 * Create a signed session token with 15-minute expiry.
 */
export function createSessionToken(userId: string): string {
	const secret = env.SESSION_SECRET;
	if (!secret) throw new Error('SESSION_SECRET environment variable is required');

	const payload: SessionPayload = {
		userId,
		expiresAt: Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000,
	};

	const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
	const signature = createHmac('sha256', secret).update(data).digest('base64url');

	return `${data}.${signature}`;
}

/**
 * Verify and decode a session token.
 */
export function verifySessionToken(token: string): SessionPayload | null {
	const secret = env.SESSION_SECRET;
	if (!secret) return null;

	const parts = token.split('.');
	if (parts.length !== 2) return null;

	const [data, signature] = parts;
	const expectedSignature = createHmac('sha256', secret).update(data).digest('base64url');

	if (signature !== expectedSignature) return null;

	try {
		const payload: SessionPayload = JSON.parse(
			Buffer.from(data, 'base64url').toString('utf-8'),
		);

		if (Date.now() > payload.expiresAt) return null;

		return payload;
	} catch {
		return null;
	}
}

/**
 * Generate a secure random token for CSRF or other purposes.
 */
export function generateToken(bytes: number = 32): string {
	return randomBytes(bytes).toString('hex');
}
