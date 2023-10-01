export type ITides = { [key: string]: ITide[] };

export interface ITide {
	state: string;
	timestamp: string;
	height?: number;
}
