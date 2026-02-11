export default {
	name: 'dropStory',
	title: 'Drop Story',
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
			description: 'Short description for cards and previews',
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
			name: 'drop',
			title: 'Related Drop',
			type: 'reference',
			to: [{ type: 'drop' }],
			description: 'Link to the associated drop',
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
	],
	preview: {
		select: {
			title: 'title',
			media: 'coverImage',
			subtitle: 'excerpt',
		},
	},
};
