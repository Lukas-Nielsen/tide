import { client } from "../func/client";
import { ILocation } from "../model/location";
import { ITideDate } from "../model/tide";

export const getLocation = client.createRequest<{ response: ITideDate[] }>()({
	endpoint: "/data/:year/:location/data.json",
});

export const getLocations = client.createRequest<{ response: ILocation[] }>()({
	endpoint: "/data/locations.json",
});
