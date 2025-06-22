import { z } from "zod";

export const CheckoutSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  city: z.string().min(1, "Kota wajib diisi"),
  postalCode: z.string().min(5, "Kode pos minimal 5 digit"),
  shippingMethod: z.enum(["regular", "express", "same_day"]),
  paymentMethod: z.enum(["bank_transfer", "e_wallet", "cod"]),
  notes: z.string().optional(),
});
