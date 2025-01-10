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
	
	interface Window {
		initMap: () => void;
		google: any;
	}
	
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
}

export {};
