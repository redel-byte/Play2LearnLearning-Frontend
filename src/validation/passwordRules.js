export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;

export const passwordMessage =
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
