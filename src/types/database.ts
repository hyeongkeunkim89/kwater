export interface FloorRoom {
  name: string;
  link: string | null;
}

export interface FloorAmenity {
  label: string;
  icon: string;
}

export interface CenterFloor {
  id: string;
  center_id: string;
  floor_key: string;
  floor_name: string;
  floor_map_url: string | null;
  description: string | null;
  rooms: FloorRoom[];
  amenities: FloorAmenity[];
  sort_order: number;
  created_at: string;
}

export interface CenterFacility {
  id: string;
  center_id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  location: string | null;
  operating_hours: string | null;
  area: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
}
