import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";




export const useValidation = (shema) => {
    return useForm({
        resolver: yupResolver(shema),
    });
};