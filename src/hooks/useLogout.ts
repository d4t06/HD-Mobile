import {publicRequest} from "../utils/request";
import {useAuth} from "@/store/AuthContext";

const useLogout = () => {
    const {setAuth} = useAuth()

    const logout = async () => {
        try {
            setAuth({token: ''})
            await publicRequest.get("/auth/logout")
        } catch (error) {
            console.log({messgae: error})
        }
    }
    return logout
}

export default useLogout