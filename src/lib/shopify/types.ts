export interface ShopifyImage {
	url: string;
	altText: string | null;
	width: number;
	height: number;
}

export interface ShopifyPrice {
	amount: string;
	currencyCode: string;
}

export interface ShopifyProductVariant {
	id: string;
	title: string;
	availableForSale: boolean;
	quantityAvailable: number | null;
	price: ShopifyPrice;
	compareAtPrice: ShopifyPrice | null;
	selectedOptions: { name: string; value: string }[];
	image: ShopifyImage | null;
}

export interface ShopifyProduct {
	id: string;
	title: string;
	handle: string;
	description: string;
	descriptionHtml: string;
	vendor: string;
	productType: string;
	tags: string[];
	availableForSale: boolean;
	featuredImage: ShopifyImage | null;
	images: { edges: { node: ShopifyImage }[] };
	variants: { edges: { node: ShopifyProductVariant }[] };
	metafields: { key: string; value: string; namespace: string; type: string }[];
	priceRange: {
		minVariantPrice: ShopifyPrice;
		maxVariantPrice: ShopifyPrice;
	};
	compareAtPriceRange: {
		minVariantPrice: ShopifyPrice;
		maxVariantPrice: ShopifyPrice;
	};
}

export interface ShopifyCollection {
	id: string;
	title: string;
	handle: string;
	description: string;
	image: ShopifyImage | null;
	products: {
		edges: { node: ShopifyProduct; cursor: string }[];
		pageInfo: { hasNextPage: boolean; endCursor: string | null };
	};
}

export interface ShopifyCart {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	cost: {
		totalAmount: ShopifyPrice;
		subtotalAmount: ShopifyPrice;
		totalTaxAmount: ShopifyPrice | null;
	};
	lines: {
		edges: {
			node: {
				id: string;
				quantity: number;
				merchandise: {
					id: string;
					title: string;
					product: { title: string; handle: string; featuredImage: ShopifyImage | null };
					price: ShopifyPrice;
					selectedOptions: { name: string; value: string }[];
					image: ShopifyImage | null;
				};
				cost: {
					totalAmount: ShopifyPrice;
					amountPerQuantity: ShopifyPrice;
				};
			};
		}[];
	};
}

export interface PageInfo {
	hasNextPage: boolean;
	endCursor: string | null;
}
