import { getClient } from './client.js';

// ============================================
// Drop Stories
// ============================================

const dropStoryFields = `
  _id,
  title,
  slug,
  excerpt,
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  publishedAt,
  body,
  "dropRef": drop->{
    title,
    slug,
    startsAt,
    type
  },
  "author": author->{
    name,
    "avatar": avatar.asset->url
  },
  tags
`;

export async function getDropStories(preview = false) {
	return getClient(preview).fetch(
		`*[_type == "dropStory"] | order(publishedAt desc) {
      ${dropStoryFields}
    }`,
	);
}

export async function getDropStory(slug: string, preview = false) {
	return getClient(preview).fetch(
		`*[_type == "dropStory" && slug.current == $slug][0] {
      ${dropStoryFields}
    }`,
		{ slug },
	);
}

// ============================================
// Editorial Articles
// ============================================

const articleFields = `
  _id,
  title,
  slug,
  excerpt,
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  category,
  publishedAt,
  body,
  "author": author->{
    name,
    "avatar": avatar.asset->url
  },
  tags,
  "relatedArticles": relatedArticles[]->{
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url
  }
`;

export async function getArticles(category?: string, preview = false) {
	const filter = category
		? `*[_type == "article" && category == $category]`
		: `*[_type == "article"]`;

	return getClient(preview).fetch(
		`${filter} | order(publishedAt desc) {
      ${articleFields}
    }`,
		{ category },
	);
}

export async function getArticle(slug: string, preview = false) {
	return getClient(preview).fetch(
		`*[_type == "article" && slug.current == $slug][0] {
      ${articleFields}
    }`,
		{ slug },
	);
}

// ============================================
// Global Settings
// ============================================

export async function getGlobalSettings(preview = false) {
	return getClient(preview).fetch(
		`*[_type == "globalSettings"][0] {
      siteName,
      siteDescription,
      "logo": logo.asset->url,
      "favicon": favicon.asset->url,
      socialLinks,
      announcement,
      "heroImage": heroImage.asset->url,
      footerText,
      navigationItems[] {
        label,
        href,
        children[] {
          label,
          href
        }
      }
    }`,
	);
}

// ============================================
// Featured Content
// ============================================

export async function getFeaturedDropStories(limit = 3, preview = false) {
	return getClient(preview).fetch(
		`*[_type == "dropStory" && featured == true] | order(publishedAt desc)[0...$limit] {
      ${dropStoryFields}
    }`,
		{ limit: limit - 1 },
	);
}

export async function getFeaturedArticles(limit = 3, preview = false) {
	return getClient(preview).fetch(
		`*[_type == "article" && featured == true] | order(publishedAt desc)[0...$limit] {
      ${articleFields}
    }`,
		{ limit: limit - 1 },
	);
}
