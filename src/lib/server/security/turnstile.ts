import { env } from '$env/dynamic/private';

interface TurnstileVerifyResult {
	success: boolean;
	'error-codes'?: string[];
}

/**
 * Verify a Cloudflare Turnstile CAPTCHA token.
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
	if (!env.TURNSTILE_SECRET_KEY) {
		console.warn('TURNSTILE_SECRET_KEY not set, skipping verification');
		return true;
	}

	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			secret: env.TURNSTILE_SECRET_KEY,
			response: token,
		}),
	});

	const result: TurnstileVerifyResult = await response.json();
	return result.success;
}
