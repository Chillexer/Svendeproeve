import axios, { AxiosError } from "axios";
import { useRouter } from "next/dist/client/router";

export default function AxiosErrorHandling() {
    const router = useRouter()

    axios.interceptors.response.use(res => res
        , (err: AxiosError) => {
            if (err.response?.status == 401)
                router.push("/api/auth/login");
            return Promise.reject(err);
        });


    axios.defaults.timeout = 10000
}