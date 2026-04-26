import * as yup from "yup"
import { passwordMessage, passwordRegex } from "./passwordRules";

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
        .matches(
            passwordRegex,
            passwordMessage
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
})
