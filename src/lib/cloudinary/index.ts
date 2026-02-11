import { env } from '$env/dynamic/public';

const CLOUD_NAME = env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'placeholder';

interface ImageTransformOptions {
	width?: number;
	height?: number;
	quality?: 'auto' | number;
	format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
	crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
	gravity?: 'auto' | 'face' | 'center';
	blur?: number;
}

/**
 * Generate a Cloudinary-optimized image URL.
 * If the source is already a Cloudinary URL, add transformations.
 * If not, use the fetch delivery type to proxy through Cloudinary.
 */
export function optimizedImageUrl(src: string, options: ImageTransformOptions = {}): string {
	const {
		width,
		height,
		quality = 'auto',
		format = 'auto',
		crop = 'fill',
		gravity = 'auto',
		blur,
	} = options;

	const transforms: string[] = [];

	if (width) transforms.push(`w_${width}`);
	if (height) transforms.push(`h_${height}`);
	if (quality) transforms.push(`q_${quality}`);
	if (format) transforms.push(`f_${format}`);
	if (crop) transforms.push(`c_${crop}`);
	if (gravity) transforms.push(`g_${gravity}`);
	if (blur) transforms.push(`e_blur:${blur}`);

	const transformString = transforms.join(',');

	// If already a Cloudinary URL, inject transformations
	if (src.includes('res.cloudinary.com')) {
		return src.replace('/upload/', `/upload/${transformString}/`);
	}

	// Use fetch delivery to proxy external images through Cloudinary
	return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transformString}/${encodeURIComponent(src)}`;
}

/**
 * Generate a blur-up placeholder URL (tiny, heavily blurred).
 */
export function placeholderUrl(src: string): string {
	return optimizedImageUrl(src, {
		width: 20,
		quality: 30,
		format: 'webp',
		blur: 1000,
	});
}

/**
 * Generate responsive image srcset.
 */
export function responsiveSrcSet(
	src: string,
	widths: number[] = [320, 640, 960, 1280, 1920],
): string {
	return widths
		.map((w) => `${optimizedImageUrl(src, { width: w })} ${w}w`)
		.join(', ');
}
