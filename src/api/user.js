import request from '@/utils/request'
export default {
  login(data) {
    return request({
      url: 'login',
      method: 'POST',
      data
    })
  },
  getListByRole(role) {
    return request({
      url: 'user/getListByRole',
      method: 'GET',
      params: {
        role
      }
    })
  },
  addUser(data) {
    return request({
      url: 'user',
      method: 'POST',
      data
    })
  },
  editUser(data) {
    return request({
      url: 'user',
      method: 'PUT',
      data
    })
  },
  deleteUser(id) {
    return request({
      url: `user/${id}`,
      method: 'DELETE'
    })
  }
}
