import * as yup from "yup";

export const profileSchema = yup.object().shape({
    firstName: yup
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters")
        .required("First name is required"),
    lastName: yup
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters")
        .required("Last name is required"),
    email: yup
        .string()
        .trim()
        .email("Invalid email format")
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Email must include a valid domain (e.g., .com, .net, .org)"
        )
        .max(255, "Email cannot exceed 255 characters")
        .required("Email is required"),
});
