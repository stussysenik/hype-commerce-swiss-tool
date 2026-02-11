/**
 * Check if a honeypot field was filled in (indicating a bot).
 * The honeypot field should be hidden via CSS and have no label.
 * If filled in, it's a bot.
 */
export function isHoneypotTriggered(formData: FormData, fieldName: string = '_hp_name'): boolean {
	const value = formData.get(fieldName);
	return typeof value === 'string' && value.length > 0;
}
