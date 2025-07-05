export type Product = {
  id: string;
  name: string;
  price: number;
  images?: { url: string }[];
  description?: string;
};
