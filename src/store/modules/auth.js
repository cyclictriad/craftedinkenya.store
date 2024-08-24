import axios from "axios"
export default {
    state: {
        user: null
    },
    getters: {
        GET_USER: state => state.user,
    },
    mutations: {
        async setUser(state, user) {
            state.user = user
        },        
        async refreshToken({ commit }) {
            await axios.post('auth/refresh-token', null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(`accessToken`)}`
                }
            })
        },
        async logout(state) {
            try {
                await axios.post(`auth/logout`, { accessToken: localStorage.getItem('accessToken') }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    },
                })
                state.user = null
                localStorage.removeItem('accessToken')
            }
            catch (error) {}
        },

    },
    actions: {
        setUser({ commit }, payload) {
            commit('setUser', payload)
        },
        refreshToken({ commit }) {
            commit('refreshToken')
        },
        logout({ commit }) {
            commit('logout')
        }
    }
}
