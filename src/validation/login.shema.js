import * as yup from "yup"

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email format")
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Email must include a valid domain (e.g., .com, .net, .org)"
        )
        .required("Email is required"),
    password: yup
        .string()
        .required("Password is required"),
});
