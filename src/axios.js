import axios from 'axios'
import store from './store'
import router from './routes'
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API_URL
axios.defaults.withCredentials = true
axios.interceptors.request.use(
    async function (config) {
        config.headers['X-Current-Path'] = btoa(encodeURIComponent(router.currentRoute.value.fullPath))
        const accessToken = localStorage.getItem('accessToken')

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config

    }
)
axios.interceptors.response.use(
    response => {
        const { accessToken, user } = response.data
        if (accessToken) {
            localStorage.setItem(`accessToken`, accessToken)
        }
        if (user) {
            store.dispatch("setUser", user)
        }
        return response
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (originalRequest.url === 'auth/refresh-token') {

                localStorage.removeItem('accessToken')
            } else {
                try {
                    if (localStorage.getItem(`accessToken`)) {
                        await axios.post(`auth/refresh-token`)
                        return axios(originalRequest)
                    }
                    
                } catch (error) {

                }
            }
        }
        return Promise.reject(error)
    }
)

