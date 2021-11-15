const ora = require('ora')
const Spinnies = require('spinnies')
const spinnies = new Spinnies({ succeedPrefix: '    ✓' })
const path = require('path')
const { withSpinner } = require('./oraUtil')
const { resolve } = require('path')

;(async () => {
  process.stderr.write('aa')
  process.stderr.write('aa')
  // for (let i = 0; i < 2; i++) {
  //   await withSpinner({ text: 'a' + i, prefixText: ' ', spinner: 'line' })(
  //     async () => {
  //       await abc()
  //     }
  //   )
  // }
  // await withSpinner('a1')(async () => {
  //   await abc()
  // })
  // withSpinner('a2')(async () => {
  //   await abc()
  // })
})()

async function abc() {
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve()
  //   }, 1000)
  // })
}
