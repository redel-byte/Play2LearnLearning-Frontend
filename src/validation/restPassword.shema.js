import * as yup from "yup"

export const restPasswordSchema = yup.object().shape({
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
        .min(8, "Password must be at least 6 characters")
        .matches(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
            "Password must contain at least 8 characters, including at least one uppercase letter, one number, and one special character"
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
})