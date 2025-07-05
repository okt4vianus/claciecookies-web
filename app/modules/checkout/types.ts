import type { CartItem } from "@/modules/cart/types";

export type OrderSummaryProps = {
  cartItems: CartItem[];
  totalPrice: number;
  shippingCost: number;
  totalWithShipping: number;
};

export type CustomerInformationProps = {
  fetcherUserProfile: any;
  formUser: any;
  fieldsUser: any;
  isSubmitting: boolean;
};

export type ShippingAddressProps = {
  fetcherUserAddress: any;
  formAddress: any;
  fieldsAddress: any;
  isSubmitting: boolean;
};
