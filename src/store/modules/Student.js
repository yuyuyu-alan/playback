const Student = {
    namespaced: true,
    state: {
        items: []
    },
    mutations: {
        setItem(state, obj) {
            state.items.push(obj)
        },
        delItem(state, uid) {
            const index = state.items.findIndex(item => item.uid === uid)
            if (index >= 0) {
                state.items.splice(index, 1)
            }
        },
        setProperty(state, {index, key, value}) {
            state.items[index][key] = value
        }
    },
    actions: {
        setProperty({commit}, obj) {
            commit('setProperty', obj)
        },
        setItem({commit}, obj) {
            commit('setItem', obj)
        },
        delItem({commit}, uid) {
            commit('delItem', uid)
        }
    }
}

export default Student
