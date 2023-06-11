export type tides = { [key: string]: tide[] };

export interface tide {
	state: string;
	timestamp: string;
	height?: number;
}
