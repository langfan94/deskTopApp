import api from '@/api'
import {
    BASEINFO,
    SHOWTOAST,
    HIDETOAST,
    SHOWLOADING,
    HIDELOADING
} from './types'

export default {
    showToast({ commit, state }, { isShow, text }) {
        if (isShow) {
            commit(SHOWTOAST, { text })
        } else {
            commit(HIDETOAST)
        }
    },
    showLoading({ commit, state }, { isShow, text }) {
        if (isShow) {
            commit(SHOWLOADING, { text })
        } else {
            commit(HIDELOADING)
        }
    },
    postLogin({ commit, state }, { params, self }) {
        state.isShowLoading = true
        api
            .login(params)
            .then(res => {
                if (res.status === 200) {
                    commit(BASEINFO, { ...res.data, self })
                } else {
                    commit(SHOWTOAST, { text: '网络错误' })
                }
            })
            .catch(res => {
                state.isShowLoading = false
            })
    },
    postReset({ commit, state }, { params, self }) {
        state.isShowLoading = true
        api
            .reset(params)
            .then(res => {
                let { msg, code } = res.data
                state.isShowLoading = false
                if (Number(code) === 0) {
                    self.$router.push({ name: 'signIn' })
                } else {
                    commit(SHOWTOAST, { text: msg })
                }
            })
            .catch(res => {
                state.isShowLoading = false
            })
    },
    postSendSms({ commit, state }, { params }) {
        state.isShowLoading = true
        api
            .sendSms(params)
            .then(res => {
                let { msg, code } = res.data
                state.isShowLoading = false
                if (Number(code) === 0) {
                    commit(SHOWTOAST, { text: '发送成功' })
                } else {
                    commit(SHOWTOAST, { text: msg })
                }
            })
            .catch(res => {
                state.isShowLoading = false
            })
    }
}
