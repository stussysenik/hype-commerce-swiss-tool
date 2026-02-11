export default {
	name: 'globalSettings',
	title: 'Global Settings',
	type: 'document',
	fields: [
		{
			name: 'siteName',
			title: 'Site Name',
			type: 'string',
		},
		{
			name: 'siteDescription',
			title: 'Site Description',
			type: 'text',
			rows: 2,
		},
		{
			name: 'logo',
			title: 'Logo',
			type: 'image',
		},
		{
			name: 'favicon',
			title: 'Favicon',
			type: 'image',
		},
		{
			name: 'heroImage',
			title: 'Default Hero Image',
			type: 'image',
			options: { hotspot: true },
		},
		{
			name: 'announcement',
			title: 'Announcement Banner',
			type: 'object',
			fields: [
				{ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: false },
				{ name: 'text', title: 'Text', type: 'string' },
				{ name: 'href', title: 'Link', type: 'url' },
			],
		},
		{
			name: 'navigationItems',
			title: 'Navigation',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'label', title: 'Label', type: 'string' },
						{ name: 'href', title: 'URL', type: 'string' },
						{
							name: 'children',
							title: 'Sub-items',
							type: 'array',
							of: [
								{
									type: 'object',
									fields: [
										{ name: 'label', title: 'Label', type: 'string' },
										{ name: 'href', title: 'URL', type: 'string' },
									],
								},
							],
						},
					],
				},
			],
		},
		{
			name: 'socialLinks',
			title: 'Social Links',
			type: 'object',
			fields: [
				{ name: 'instagram', title: 'Instagram', type: 'url' },
				{ name: 'twitter', title: 'Twitter/X', type: 'url' },
				{ name: 'tiktok', title: 'TikTok', type: 'url' },
				{ name: 'discord', title: 'Discord', type: 'url' },
			],
		},
		{
			name: 'footerText',
			title: 'Footer Text',
			type: 'text',
			rows: 2,
		},
	],
	preview: {
		prepare: () => ({
			title: 'Global Settings',
		}),
	},
};
