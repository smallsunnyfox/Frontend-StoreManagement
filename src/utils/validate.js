/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validatePhone(str) {
  if (!str) {
    return false
  }
  str = str.trim()
  if (str !== '') {
    const reg = /(^1\d{10}$)/
    if (reg.test(str)) {
      return true
    }
  }
  return false
}
