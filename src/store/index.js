//store.js
import Vuex from 'vuex';
import cart from './modules/cart';
import auth from './modules/auth';
import storeItems from './modules/store';
import dm from './modules/dm'


const store = new Vuex.Store({
    modules:{
        auth,
        cart,
        dm,
        storeItems
    },    
});

export default store;


