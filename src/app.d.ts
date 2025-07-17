import type { PrismaClient } from "@prisma/client";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        cars: string[];
        role: "USER" | "DRIVER" | "ADMIN";
      };
    }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

  // DB Connection
	var prisma: PrismaClient
  
  // For some reason `npx prisma generate` doesn't 
  // create types for Session in schema
  type Session = {
    id: string;
    userId: string;
    expiresAt: Date;
  };	

  // Drivers
  interface driverDataType {
    driver: string,
    racingNumber: number,
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
    configuration: string[];
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

  // Blog posts
  export interface BlogPost {
    id: string;
    title: string;
    imageRef: string;
    content: string;
    authorId: string;
    createdAt: Date;
    status: 'draft' | 'published';
  }
}

export {};
