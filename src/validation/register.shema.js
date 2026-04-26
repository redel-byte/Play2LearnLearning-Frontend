import * as yup from "yup"
import { passwordMessage, passwordRegex } from "./passwordRules";

export const registerShema = yup.object().shape({
    firstName: yup
        .string()
        .min(3, "First Name shoud be 3 character at least")
        .required("First Name is required"),
    lastName: yup
        .string()
        .min(3, "Last Name shoud be 3 character at least")
        .required("Last Name is required"),
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
    role: yup
        .string()
        .oneOf(["learner", "teacher"], "Please choose Student or Teacher")
        .required("Role is required"),
})
