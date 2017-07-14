import axios from 'axios'
export default {
    /* 基础 */
    reset(data) {
        return axios
            .post('/api/auth/reset_password', data)
    },
    login(data) {
        return axios
            .post('/api/auth/login', data)
    },
    register(data) {
        return axios
            .post('/api/auth/register', data)
    },
    sendSms(data) {
        return axios
            .post('/api/common/send_sms', data)
    },
    verifySms(data) {
        return axios
            .post('/api/common/verify_sms', data)
    }
}
