// ✨ implement axiosWithAuth
import axios from "axios";

const axiosWithAuth = () => {
    const token = localStorage.getItem('token')
    const instance = axios.create({
        baseURL: 'http://localhost:9000/api',
        headers: {
            authorization: token
        }
    })
        return instance
}

export default axiosWithAuth