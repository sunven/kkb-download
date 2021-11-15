const httpUtil = require('./httpUtil')
const { bearer, dir } = require('./config')
const fs = require('fs')
const path = require('path')
const section = require('./section')
const { withSpinner } = require('./oraUtil')
module.exports = async ({ course_id, course_name }) => {
  const chapterUrl = `https://weblearn.kaikeba.com/student/courseinfo?course_id=${course_id}`
  const chapterRet = await httpUtil.get(chapterUrl, {
    auth: {
      bearer,
    },
    json: true,
  })
  const data = chapterRet.data.chapter_list.slice(0, 2)
  for (let i = 0; i < data.length; i++) {
    const chapter = data[i]
    const dirpath = path.join(dir, course_name, chapter.chapter_name)
    if (fs.existsSync(dirpath)) {
      break
    } else {
      fs.mkdirSync(dirpath)
    }
    // global.spinnies.add(' ' + chapter.chapter_name)
    // await section({
    //   course_id,
    //   course_name,
    //   chapter_id: chapter.chapter_id,
    //   chapter_name: chapter.chapter_name,
    // })
    // global.spinnies.succeed(' ' + chapter.chapter_name)
    await withSpinner({
      text: chapter.chapter_name,
      prefixText: ' ',
      spinner: 'line',
    })(async () => {
      await section({
        course_id,
        course_name,
        chapter_id: chapter.chapter_id,
        chapter_name: chapter.chapter_name,
      })
    })
  }
}
