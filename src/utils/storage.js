import { Base64 } from 'js-base64'

export default {
  storage: null,
  get(key) {
    const value = this.getStorage().getItem(Base64.encode(key))
    if (value) {
      return JSON.parse(Base64.decode(value))
    }
    return false
  },
  set(key, value) {
    key = Base64.encode(key)
    value = Base64.encode(JSON.stringify(value))
    this.getStorage().setItem(key, value)
  },
  remove(key) {
    this.getStorage().removeItem(Base64.encode(key))
  },
  getStorage() {
    if (typeof localStorage !== 'undefined') {
      this.storage = localStorage
    } else if (!this.storage) {
      this.storage = {
        setItem(key, value) {
          this[key] = value
        },
        getItem(key) {
          return this[key]
        },
        removeItem(key) {
          return delete this[key]
        }
      }
    }
    return this.storage
  }
}
