import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
    const [isAuth, setAuth] = useState(
        !!localStorage.getItem("user") ||
        !!sessionStorage.getItem("user")
    );
    const toastShown = useRef(false);

    useEffect(() => {
        if (!isAuth && !toastShown.current) {
            toast("Login First", {
                icon: '⚠️',
                style: {
                    background: '#fef3c7',
                    color: '#92400e',
                },
            });
            toastShown.current = true;
        }
    }, [isAuth]);

    return isAuth ? children : <Navigate to="/login" />;
};
export default ProtectedRoute;