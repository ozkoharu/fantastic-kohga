import * as Leaflet from "leaflet";

// システム全体で使いそうな型たち

export type Position = Leaflet.LatLng;

export interface PassbleNames {
    routeName: string,
    available: boolean,
};
export interface PassableInfo {
    position: Position,
    radius: number,
    passableId: number,
};
