import socketioService from "../../services/socketio.service";

export default {
    state: {
        service: socketioService,
        chat: null,
        newMessagesCount: 0,
        connected: false,
        clients: [],
    },
    getters: {
        GET_CHAT: state => state.chat,
        GET_UNREAD: state => state.chat?.messages.filter(message => !message.seen) || [],
        GET_CLIENTS: state => state.clients,
        GET_SERVICE: state => state.service,
        GET_CONNECTION: state => state.connected
    },
    mutations: {
        UPDATE_USERS(state, users) {
            state.users = users
        },
        START_SERVICE(state) {
            state.service.setupSocketConnection();
            state.service.on("connect", () => {
                state.connected = true
                state.service.on("new-message", messages => {
                    state.newMessagesCount += 1
                    state.chat.messages = messages
                });
                state.service.on("other-seen", () => {
                    state.chat.messages.map(message => message.seen = true);
                })
                state.service.on("new-chat", (_chat) => (state.chat = _chat));
                state.service.on("chat-cleared", () => (state.chat.messages = []));
                state.service.on("client-joined", (clients) => {
                    state.clients = state.chat ? [{ name: state.chat.client.name, sid: state.chat.client.sid }].concat(clients) : clients
                })
                state.service.on("client-left", (clients) => {
                    state.clients = state.chat ? [{ name: state.chat.client.name, sid: state.chat.client.sid }].concat(clients) : clients            })
            })
            state.service.on("disconnect", () => state.connected = false)
        }
    },
    actions: {
        updateUsers({ commit }, users) {
            commit('UPDATE_USERS', users)
        },
        startService({ commit }) {
            commit('START_SERVICE')
        }
    }
}