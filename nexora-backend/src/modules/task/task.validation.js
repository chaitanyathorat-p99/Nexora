import { z } from "zod";

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Task title is required"),
        description: z.string().optional(),
        dueDate: z.string().iso.date().optional(),
        assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/,"Invalid User Id"),
        stage: z.enum(["To Do", "In Progress", "Done", "New"]).default("New"),
        subtasks: z.array(z.object({
            title: z.string().min(1, "Subtask title is required"),
            isCompleted: z.boolean().default(false)
        })).optional().default([])
    }),
});