import { z } from 'zod';

export const createLeadSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, "First Name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email"),
        leadValue: z.coerce.number().nonnegative().default(0),
        leadWeight: z.enum(["Hot", "Warm", "Cold"]),
        mobile: z.string().min(10, "Mobile number required"),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().default("India"),
        typeOfBuyer: z.string().optional(),
        industryType: z.string().optional(),
        source: z.string().optional(),
        status: z.enum(["Active","Inactive","Pending"]).default("Active"),
        assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID").optional(),
    }),
});