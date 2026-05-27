export interface Coord {
  name: string;
  lat: number;
  lng: number;
}

export interface Drive {
  date: string;
  title: string;
  distance: string;
  duration: string;
  stops: string[];
  coords: Coord[];
  desc: string;
  cafe: string;
}

export interface Route {
  region: string;
  title: string;
  distance: string;
  duration: string;
  stops: string[];
  coords: Coord[];
  desc: string;
  cafe: string;
  parking: string;
  directions: string;
}
