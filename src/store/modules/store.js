import axios from "axios"

export default {
    state: {
        products: []
    },
    getters: {
        products: state => state.products,
        getProducts: (state, category) => state.products.filter(product => product.category === category)

    },
    mutations: {
        async fetchProducts(state) {
            try {
                const products = await axios(`products`)
                state.products = products.data
            } catch (error) {
                console.error(error)
            }
        },
    },
    actions: {
        fetchProducts({ commit }) {
            commit('fetchProducts')
        },
    }
}