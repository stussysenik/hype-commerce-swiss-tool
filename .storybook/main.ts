import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
	stories: ['../stories/**/*.stories.@(js|ts|svelte)', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-a11y',
	],
	framework: {
		name: '@storybook/svelte-vite',
		options: {},
	},
};

export default config;
