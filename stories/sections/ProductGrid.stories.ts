import type { Meta, StoryObj } from '@storybook/svelte';
import ProductGrid from '$lib/components/sections/ProductGrid.svelte';

const mockProducts = Array.from({ length: 9 }, (_, i) => ({
	id: `product-${i + 1}`,
	title: `Product ${i + 1}`,
	handle: `product-${i + 1}`,
	price: `$${(Math.random() * 300 + 50).toFixed(0)}`,
	compareAtPrice: i % 3 === 0 ? `$${(Math.random() * 200 + 300).toFixed(0)}` : undefined,
	image: {
		url: `https://placehold.co/600x600/222/444?text=Product+${i + 1}`,
		alt: `Product ${i + 1}`,
	},
	badge: i === 0 ? 'New' : i === 2 ? 'Sold Out' : undefined,
}));

const meta = {
	title: 'Sections/ProductGrid',
	component: ProductGrid,
	tags: ['autodocs'],
} satisfies Meta<ProductGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Latest Drops',
		products: mockProducts,
		columns: 3,
	},
};

export const WithFilters: Story = {
	args: {
		title: 'Shop All',
		products: mockProducts,
		filters: [
			{ label: 'All', value: 'all' },
			{ label: 'Footwear', value: 'footwear' },
			{ label: 'Apparel', value: 'apparel' },
			{ label: 'Accessories', value: 'accessories' },
		],
		activeFilter: 'all',
	},
};

export const WithSidebar: Story = {
	args: {
		title: 'Collection',
		products: mockProducts,
		showSidebar: true,
		filters: [
			{ label: 'All', value: 'all' },
			{ label: 'Footwear', value: 'footwear' },
			{ label: 'Apparel', value: 'apparel' },
			{ label: 'Accessories', value: 'accessories' },
		],
	},
};

export const FourColumns: Story = {
	args: {
		products: mockProducts,
		columns: 4,
	},
};
