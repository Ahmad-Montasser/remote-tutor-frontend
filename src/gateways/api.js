import axios from "axios";
import store from '../store'
import router from '../router'

const url = process.env.VUE_APP_API_URL;

let api = axios.create({
    baseURL: url
});
// REQUEST interceptors
api.interceptors.request.use(function (config) {
    const token = store.state.userData.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, function (error) {
    return Promise.reject(error);
});

// RESPONSE interceptors
api.interceptors.response.use(function (response) {
    if (response.data.message !== undefined) {
        store.dispatch("viewSnackbar", {
            text: response.data.message,
            color: "success"
        })
    }
    return response;
}, function (error) {
    let status = error.response.status
    if ((status === 400 || status === 401) && router.currentRoute.name !== 'Login') {
        router.push({name: 'Login'})
    }
    if (error.response.data.message !== undefined) {
        store.dispatch("viewSnackbar", {
            text: error.response.data.message,
            color: "error"
        })
    }
    return Promise.reject(error);
});
export default api 