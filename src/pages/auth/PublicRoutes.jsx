import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
 
const PublicRoutes = ({ children }) => {
    const [isAuth, setAuth] = useState(
        !!localStorage.getItem("user") ||
        !!sessionStorage.getItem("user")
    );
    const toastShown = useRef(false);
 
    useEffect(() => {
        if (isAuth && !toastShown.current) {
            toast("You Alredy Loged in", {
                icon: '⚠️',
                style: {
                    background: '#fef3c7',
                    color: '#92400e',
                },
            });
            toastShown.current = true;
        }
    }, [isAuth]);
 
    if (isAuth) {
        return <Navigate to="/" replace />;
    }
 
    return children;
};

export default PublicRoutes;