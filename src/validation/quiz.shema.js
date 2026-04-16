import * as yup from "yup";

const trimText = (value) => (typeof value === "string" ? value.trim() : value);

const parseOptionalNumber = (value, originalValue) => {
    if (originalValue === "" || originalValue === null || typeof originalValue === "undefined") {
        return null;
    }

    return Number(originalValue);
};

const parseRequiredNumber = (value, originalValue) => {
    if (originalValue === "" || originalValue === null || typeof originalValue === "undefined") {
        return NaN;
    }

    return Number(originalValue);
};

const questionSchema = yup.object().shape({
    question: yup
        .string()
        .transform(trimText)
        .min(3, "Question prompt must be at least 3 characters")
        .required("Question prompt is required"),
    options: yup
        .array()
        .of(yup.string().transform(trimText).default(""))
        .length(4, "Each question must keep 4 option slots")
        .test(
            "filled-options",
            "Each question needs at least 2 answer choices",
            (options = []) => options.filter((option) => option).length >= 2,
        )
        .test(
            "unique-options",
            "Answer choices must be unique",
            (options = []) => {
                const normalized = options.filter((option) => option).map((option) => option.toLowerCase());
                return new Set(normalized).size === normalized.length;
            },
        ),
    correctAnswer: yup
        .number()
        .transform(parseRequiredNumber)
        .typeError("Select a correct answer")
        .integer("Select a correct answer")
        .min(0, "Select a correct answer")
        .max(3, "Select a correct answer")
        .required("Select a correct answer")
        .test(
            "filled-correct-answer",
            "Correct answer must point to a filled option",
            function (value) {
                const options = this.parent.options || [];
                return typeof value === "number" && Boolean(options[value]?.trim());
            },
        ),
    explanation: yup
        .string()
        .transform(trimText)
        .nullable(),
    points: yup
        .number()
        .transform(parseRequiredNumber)
        .typeError("Points must be a number")
        .integer("Points must be a whole number")
        .min(1, "Points must be at least 1")
        .max(100, "Points must be 100 or fewer")
        .required("Points are required"),
});

export const quizSchema = yup.object().shape({
    title: yup
        .string()
        .transform(trimText)
        .min(3, "Quiz title must be at least 3 characters")
        .required("Quiz title is required"),
    description: yup
        .string()
        .transform(trimText)
        .nullable(),
    timeLimit: yup
        .number()
        .transform(parseOptionalNumber)
        .nullable()
        .integer("Time limit must be a whole number")
        .min(1, "Time limit must be at least 1 minute")
        .max(1440, "Time limit must be 1440 minutes or fewer"),
    maxAttempts: yup
        .number()
        .transform(parseRequiredNumber)
        .typeError("Maximum attempts must be a number")
        .integer("Maximum attempts must be a whole number")
        .min(1, "Maximum attempts must be at least 1")
        .max(20, "Maximum attempts must be 20 or fewer")
        .required("Maximum attempts is required"),
    passPercentage: yup
        .number()
        .transform(parseRequiredNumber)
        .typeError("Pass percentage must be a number")
        .integer("Pass percentage must be a whole number")
        .min(0, "Pass percentage must be at least 0")
        .max(100, "Pass percentage must be 100 or fewer")
        .required("Pass percentage is required"),
    isPublic: yup.boolean().required(),
    questions: yup
        .array()
        .of(questionSchema)
        .min(1, "Add at least one question")
        .required("Add at least one question"),
});
