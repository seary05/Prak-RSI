export interface Stall {
  id: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  ownerId?: number | null;
  avgRating?: number;
  reviewCount?: number;
  isPopular?: boolean;
}

export interface StallInput {
  name: string;
  category?: string;
  location?: string;
  description?: string;
}

export interface StallListParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StallListResult {
  items: Stall[];
  pagination: Pagination;
}