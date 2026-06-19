export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type BusinessType = 'individual' | 'company' | 'partnership';

export interface SellerDto {
  _id: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  gstNumber?: string;
  panNumber: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
  commission: number;
  status: SellerStatus;
  isActive: boolean;
  createdAt: string;
}

export interface RegisterSellerDto {
  businessName: string;
  businessType: BusinessType;
  gstNumber?: string;
  panNumber: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
}
