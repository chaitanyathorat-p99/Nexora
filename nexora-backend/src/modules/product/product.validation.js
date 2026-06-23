import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product Name is required"),
    productType: z.string().min(1, "Product Type is required"),
    priceType: z.string().min(1, "Price Type is required"),
    price: z.coerce.number().nonnegative("Price cannot be negative"),
    discount: z.coerce.number().min(0).max(100).optional().default(0),
    subscriptionCycle: z.coerce.number().optional().nullable(),
    billingCycle: z.string().optional().nullable(),
    createdBy: z.string().optional().nullable(),
  }),
});
