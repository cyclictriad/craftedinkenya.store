//cart.js
export default {
    state: {
        activeTab: 'home',
        cartItems: [],
        budget: 0,
    },
    getters: {
        totalBill: state => state.cartItems.length && state.cartItems.map(item => item.quantity * item.sp).reduce((a, b) => a + b) || 0,
        itemCount: state => state.cartItems.length && state.cartItems.map(item => item.quantity).reduce((a, b) => a + b) || 0,
        activeTab: state => state.activeTab,
        budget: state => state.budget

    },
    mutations: {
        updateTab(state, tab) {
            state.activeTab = tab
        },
        addToCart(state, product) {
            if (state.cartItems.findIndex(item => item.id === product.id) != -1) state.cartItems = state.cartItems.filter(item => item.id !== product.id)
            state.cartItems.push(product);
        },
        setBudget(state, budget) {
            state.budget = budget
            
        },
        removeFromCart(state, id) {
            state.cartItems = state.cartItems.filter(item => item.id !== id)
        },
        clearCart(state) {
            state.cartItems = []
            state.itemCount = 0
        }
    },
    actions: {
        updateTab({ commit }, tab) {
            commit('updateTab', tab)
        },
        addToCart({ commit }, payload) {
            commit('addToCart', payload)
        },
        setBudget({ commit }, budget) {
            commit('setBudget', budget)
        },
        removeFromCart({ commit }, id) {
            commit('removeFromCart', id)
        },
        clearCart({ commit }) {
            commit('clearCart')
        }
    },

}



