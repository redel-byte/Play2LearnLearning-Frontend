import * as yup from "yup";

export const joinQuizSchema = yup.object().shape({
    code: yup
        .string()
        .transform((value) => (typeof value === "string" ? value.trim().toUpperCase() : ""))
        .matches(/^[A-Z0-9-]+$/, "Quiz code can only contain letters, numbers, and hyphens")
        .min(3, "Quiz code must be at least 3 characters")
        .max(20, "Quiz code must be 20 characters or fewer")
        .required("Quiz code is required"),
});
