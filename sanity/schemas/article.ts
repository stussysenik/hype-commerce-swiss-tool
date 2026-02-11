export default {
	name: 'article',
	title: 'Editorial Article',
	type: 'document',
	fields: [
		{
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule: { required: () => unknown }) => Rule.required(),
		},
		{
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule: { required: () => unknown }) => Rule.required(),
		},
		{
			name: 'excerpt',
			title: 'Excerpt',
			type: 'text',
			rows: 3,
		},
		{
			name: 'coverImage',
			title: 'Cover Image',
			type: 'image',
			options: { hotspot: true },
			fields: [
				{
					name: 'alt',
					title: 'Alt Text',
					type: 'string',
				},
			],
		},
		{
			name: 'category',
			title: 'Category',
			type: 'string',
			options: {
				list: [
					{ title: 'Culture', value: 'culture' },
					{ title: 'Style', value: 'style' },
					{ title: 'Behind the Scenes', value: 'behind-the-scenes' },
					{ title: 'Interview', value: 'interview' },
					{ title: 'Guide', value: 'guide' },
				],
			},
		},
		{
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [
				{ type: 'block' },
				{
					type: 'image',
					options: { hotspot: true },
					fields: [
						{ name: 'alt', title: 'Alt Text', type: 'string' },
						{ name: 'caption', title: 'Caption', type: 'string' },
					],
				},
			],
		},
		{
			name: 'author',
			title: 'Author',
			type: 'reference',
			to: [{ type: 'author' }],
		},
		{
			name: 'publishedAt',
			title: 'Published At',
			type: 'datetime',
		},
		{
			name: 'featured',
			title: 'Featured',
			type: 'boolean',
			initialValue: false,
		},
		{
			name: 'tags',
			title: 'Tags',
			type: 'array',
			of: [{ type: 'string' }],
			options: { layout: 'tags' },
		},
		{
			name: 'relatedArticles',
			title: 'Related Articles',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'article' }] }],
		},
	],
	preview: {
		select: {
			title: 'title',
			media: 'coverImage',
			subtitle: 'category',
		},
	},
};
