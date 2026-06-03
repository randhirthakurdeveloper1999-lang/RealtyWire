export type Property = {
  id: string;
  images: string[];
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  rooms: string;
  baths: string;
  price: string;
  description: string;
  rating: number;
  status: 'active' | 'sold';
};