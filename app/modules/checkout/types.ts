import type { CartItem } from "@/modules/cart/types";

export type OrderSummaryProps = {
  cartItems: CartItem[];
  totalPrice: number;
  shippingCost: number;
  totalWithShipping: number;
};

export type CustomerInformationFormProps = {
  fetcherUserProfile: any;
  formUser: any;
  fieldsUser: any;
  isSubmitting: boolean;
};

export type ShippingAddressFormProps = {
  fetcherUserAddress: any;
  formShippingAddress: any;
  fieldsAddress: any;
  isSubmitting: boolean;
};
