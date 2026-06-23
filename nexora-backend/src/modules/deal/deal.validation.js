import { z } from "zod";

export const createDealSchema = z.object({
    body: z.object({
        lead: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a Lead"),
        dealType: z.enum(["New", "Expansion", "Profession Services"], {
            errorMap: () => ({ message: "Deal type is required" })
        }),
        dealStages: z.enum(["New", "Qualification", "Discovery", "Demo", "Negotiation", "Won", "Lost"], {
            errorMap: () => ({ message: "Deal stages are required" })
        }),
        currencyType: z.enum(["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "SGD", "NZD", "HKD", "SEK", "KRW", "NOK", "MXN", "PHP", "IDR", "BRL"], {
            errorMap: () => ({ message: "Currency type is required" })
        }),
        dealValue: z.number().nonnegative("Deal value is required"),
        product: z.array(z.object({
            productId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
            name: z.string().optional(),
            productType: z.string().optional(),
            priceType: z.string().optional(),
            price: z.number().optional(),
            discount: z.number().optional(),
            quantity: z.number().int().positive().default(1),
            total: z.number().optional()
        })).optional(),
        totalWithDiscount: z.number().optional(),
        dynamicFields: z.record(z.any()).optional()
    })
});