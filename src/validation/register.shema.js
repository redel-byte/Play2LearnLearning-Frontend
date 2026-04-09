import * as yup from "yup"


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
        .min(8, "Password shoud be 8 symbols")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Password must contain at least 8 characters, including at least one letter, one number, and one special character"
        )
        .required("Password is required"),
})