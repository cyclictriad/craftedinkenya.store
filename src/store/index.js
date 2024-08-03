//store.js
import Vuex from 'vuex';
import cart from './modules/cart';
import auth from './modules/auth';
import storeItems from './modules/store';


const store = new Vuex.Store({
    modules:{
        auth,
        cart,
        storeItems
    },
    state:{
        i:0
    }
    
});

export default store;


