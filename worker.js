const download = require('./download')
const path = require('path')

// 监听子进程发送的信息
process.on('message', async data => {
  const basename = path.basename(data.path)
  //console.log(`进程${process.pid}开始下载：${basename}`)
  await download(data.url, data.path)
  //console.log(`进程${process.pid}下载结束：${basename}`)
  process.send(process.pid)
})

// 收到kill信息，进程退出
// kill 是发送SIGHUP
process.on('SIGHUP', function () {
  process.exit()
})
