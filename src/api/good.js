import request from '@/utils/request'
export default {
  addGood(data) {
    return request({
      url: 'good',
      method: 'POST',
      data
    })
  },
  editGood(data) {
    return request({
      url: 'good',
      method: 'PUT',
      data
    })
  },
  getGoodList(params) {
    return request({
      url: 'good/getList',
      method: 'GET',
      params
    })
  },
  deleteGood(id) {
    return request({
      url: `good/${id}`,
      method: 'DELETE'
    })
  },
  validateGood(goodName) {
    return request({
      url: 'good/verifyDbIsExistByGoodName',
      method: 'GET',
      params: {
        goodName
      }
    })
  }
}
