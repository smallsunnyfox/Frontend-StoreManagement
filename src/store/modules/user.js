/* eslint-disable */
import user from '@/api/user'
import md5 from 'md5'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    const newPsw = md5(password)
    console.log(newPsw)
    commit('SET_TOKEN', username)
    commit('SET_NAME', username)
    setToken(username)
    // return new Promise((resolve, reject) => {
    //   user.login({ username: username.trim(), password: password }).then(res => {
    //     commit('SET_TOKEN', res.name)
    //     commit('SET_NAME', res.name)
    //     setToken(res.name)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },
  setInfo({ commit }, name) {
    commit('SET_NAME', name)
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

