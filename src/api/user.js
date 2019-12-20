import request from '@/utils/request'
import qs from 'qs'
export default {
  login(data) {
    return request({
      url: 'user/login',
      method: 'POST',
      data: qs.stringify(data)
    })
  }
}
