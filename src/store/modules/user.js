/* eslint-disable */
import user from '@/api/user'
import md5 from 'md5'
import storage from '@/utils/storage'
import { resetRouter } from '@/router'

const state = {
  token: storage.get('token'),
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
    return new Promise((resolve, reject) => {
      user.login({ username: username.trim(), password: newPsw }).then(res => {
        if (res.codeName) {
          resolve(res.msgName)
        } else {
          commit('SET_TOKEN', res.token)
          commit('SET_NAME', res.user.idName )
          storage.set('token', res.token)
          storage.set('name', res.user.idName)
          resolve('success')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  setInfo({ commit }, name) {
    commit('SET_NAME', name)
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      storage.remove('token')
      storage.remove('name')
      resetRouter()
      resolve()
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      storage.remove('token')
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

