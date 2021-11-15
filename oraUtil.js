'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.withSpinner = void 0
const ora = require('ora')
const withSpinner = option => async target => {
  if (process.env.DEBUG) {
    return target()
  }
  const spinner = ora(option)
  try {
    spinner.start()
    const result = await target()
    spinner.succeed()
    return result
  } catch (e) {
    spinner.fail()
    throw e
  }
}
exports.withSpinner = withSpinner
