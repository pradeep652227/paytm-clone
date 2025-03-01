import e from 'express';
import { z } from 'zod';

export default z;

export const userSignupSchema = z.object({
    username: z.string().min(3).max(255),
    email: z.string().min(3).email(),
    password: z.string().min(6).max(255),
    firstName: z.string().min(3).max(255),
    lastName: z.string().min(3).max(255).optional(),
}).superRefine((data, ctx) => {
    const password = data.password;
    const errors = [];

    if (!/[A-Z]/.test(password)) {
        errors.push("at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("at least one number");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>_\-]/.test(password)) {
        errors.push("at least one special character");
    }

    // If there are errors, add a single issue listing all problems
    if (errors.length > 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Password must contain ${errors.join(", ")}`,
            path: ["password"],
        });
    }
});

export const userSigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

/*MongoDB Models Schemas*/
export const UserSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string().optional(),
    createdAt : z.date().optional(),
    updatedAt : z.date().optional(),
});