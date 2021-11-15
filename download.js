const fs = require('fs')
const request = require('request')

module.exports = (url, path) => {
  return new Promise(resolve => {
    if (fs.existsSync(path)) {
      resolve()
    } else {
      let stream = fs.createWriteStream(path)
      request(url)
        .on('error', e => {
          console.log('download error:')
          console.log(url)
          console.log(e)
        })
        .pipe(stream)
        .on('close', () => resolve())
    }
  })
}
