const { fork } = require('child_process')
const cpus = require('os').cpus().length

module.exports = tsArr =>
  new Promise(resolve => {
    let workpool = {}
    let i = 0
    let taskRecord = {}
    for (let index = 0; index < cpus; index++) {
      const work = fork('./worker.js')
      work.on('message', onmessage)
      work.send(tsArr[i])
      workpool[work.pid] = work
      taskRecord[work.pid] = [i]
      i++
    }

    function onmessage(data) {
      //console.log(msg)
      if (i < tsArr.length) {
        workpool[data].send(tsArr[i])
        taskRecord[data].push(tsArr[i])
        i++
      } else {
        //console.log(taskRecord[msg.pid])
        workpool[data].kill('SIGHUP')
      }
      if (Object.values(workpool).every(c => c.killed)) {
        resolve(taskRecord)
      }
    }
  })
