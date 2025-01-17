import type { PrismaClient } from "@prisma/client";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

  // DB Connection
	var prisma: PrismaClient
	

  // Drivers
  interface driverDataType {
    driver: string,
    racingNumber: number,
    car: string,
    birthday: string,
    cars: Array<string>,
    description: string
  }
  type Drivers = Record<string, driverDataType>

  // Cars
  interface carHistoryDataType {
    tag: string;
    updateDate: string;
    description: string;
    power: string[];
    underbody: string[];
    body: string[];
    interior: string[];
    misc: string[];
  }
  interface carDataType {
    name: string;
    year: number;
    make: string;
    model: string;
    intro: string;
    history: carHistoryDataType[];
  }
  type Cars = Record<string, carDataType>;

  // Tracks
  interface Track {
    name: string;
    type: string;
    location: string;
    turns: number;
    description: string;
  }
  type Tracks = Record<string, Track>;

  // Google Maps
	namespace google.maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
    }
    class Marker {
      constructor(options: MarkerOptions);
    }
    interface MapOptions {
      zoom: number;
      center: LatLngLiteral;
    }
    interface MarkerOptions {
      position: LatLngLiteral;
      map: Map;
      title?: string;
    }
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  }
	interface Window {
		initMap: () => void;
		google: any;
	}
}

export {};
