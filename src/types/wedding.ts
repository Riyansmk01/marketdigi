export interface RSVPRecord {
  id?: string;
  name: string;
  attendance: "hadir" | "tidak_hadir" | "ragu";
  guests_count: number;
  message?: string;
  created_at?: string;
}

export interface WishRecord {
  id: string;
  name: string;
  attendance: "hadir" | "tidak_hadir" | "ragu";
  message: string;
  created_at: string;
}
