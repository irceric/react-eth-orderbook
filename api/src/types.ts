export interface PoloniexOrder extends Array<string|number>{0: string, 1: number};
export interface BittrexOrder {
	quantity: string;
	rate: string;
}

export interface PoloniexOrderBook {
	asks: PoloniexOrder[];
	bids: PoloniexOrder[];
	isFrozen: string;
	seq: number;
}

export interface NormalizedOrder {
	quantity: number;
	rate: number;
}

export interface Exchange {
	name: string;
	url: string;
}

export type OrderType  = 'asks' | 'bids';