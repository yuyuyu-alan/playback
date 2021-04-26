const Teacher = {
    namespaced: true,
    state: {
        teacher: null,
        networkInfo: null
    },
    mutations: {
        setTeacher(state, obj) {
            state.teacher = obj
        },
        setProperty(state, {key, value}) {
            state.teacher[key] = value
        },
        setNetworkInfo(state, obj) {
            state.networkInfo = obj
        },
    },
    actions: {
        setProperty({commit}, obj) {
            commit('setProperty', obj)
        },
        setTeacher({commit}, obj) {
            commit('setTeacher', obj)
        },
        setNetworkInfo({commit}, obj) {
            commit('setNetworkInfo', obj)
        }
    }
}

export default Teacher
