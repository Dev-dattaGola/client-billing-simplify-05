
export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientFilterParams {
  search?: string;
  tag?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}
