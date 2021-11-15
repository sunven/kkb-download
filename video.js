const path = require('path')
const { spawn } = require('child_process')
const httpUtil = require('./httpUtil')
const download = require('./download')
const { bearer } = require('./config')
const downloadtsfile = require('./downloadtsfile')
const fs = require('fs')

module.exports = async ({ content_id, content_title, dir }) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  // 1. content
  const contentUrl =
    'https://weblearn.kaikeba.com/student/course/content?content_id=' +
    content_id
  const contentRet = await httpUtil.get(contentUrl, {
    auth: {
      bearer,
    },
    json: true,
  })
  const title = `${contentRet.data.location.chapter.desc} ${contentRet.data.location.section.desc} ${contentRet.data.content_title}`
  //console.log(title)
  const boot_params = contentRet.data.content[0].boot_params
  let mediaId = boot_params.mediaId ? boot_params.mediaId : boot_params.media_id

  // 2. access_token
  const tokenRet = await httpUtil.get(
    'https://weblearn.kaikeba.com/get/bsy_video/access_token',
    {
      auth: {
        bearer,
      },
      json: true,
    }
  )
  const access_token = tokenRet.data.access_token

  // 3. detail
  const detailUrl = `https://api-vod.baoshiyun.com/vod/v1/platform/media/detail?mediaId=${mediaId}&accessToken=${access_token}`
  const detailRet = await httpUtil.get(detailUrl, { json: true })
  const video = detailRet.data.mediaMetaInfo.videoGroup.find(
    c => c.resolution === '超清'
  )
  //4. download .m3u8 file
  const m3u8URL = new URL(video.playURL)
  const m3u8Name = path.basename(m3u8URL.pathname)
  const m3u8FilePath = path.join(dir, m3u8Name)
  await download(video.playURL, m3u8FilePath)

  // 5. get encryption
  const encryptUrl = `https://api-vod.baoshiyun.com/vod/v1/platform/encryption/player?mediaId=${mediaId}&videoId=${
    video.videoId
  }&MtsHlsUriToken=${m3u8URL.searchParams.get('MtsHlsUriToken')}`
  const encryptRet = await httpUtil.get(encryptUrl)

  // 6. write encryption
  fs.writeFileSync(path.join(dir, 'key.txt'), encryptRet)

  // 7. modify .m3u8 file
  let m3u8Str = fs.readFileSync(m3u8FilePath).toString()
  m3u8Str = m3u8Str.replace(/URI="(.*)"/, 'URI="key.txt"')
  fs.writeFileSync(m3u8FilePath, m3u8Str)

  // 8. download .ts file
  const tsArr = [...m3u8Str.matchAll(/(.*\.ts)/g)].map(c => c[0])
  const tsDownArr = tsArr.map(c => ({
    url: `https://v.baoshiyun.com/resource/${mediaId}/${video.presetName}/${c}`,
    path: path.join(dir, c),
  }))
  await downloadtsfile(tsDownArr)

  // 9. ffmpeg
  //ffmpeg -allowed_extensions ALL -protocol_whitelist "file,http,crypto,tcp" -i d035a00a99cc4c05bcd3110b5fac8740.m3u8 b.mp4
  // const command = `-allowed_extensions ALL -protocol_whitelist file,http,crypto,tcp -i ${m3u8Name} sp.mp4`
  // const proc = spawn('ffmpeg', command.split(' '), { cwd: dir })
  // proc.stdout.pipe(process.stdout)
  // proc.stderr.pipe(process.stderr)
  // proc.on('close', () => {
  //   console.log('ffmpeg end')
  // })

  const commandStr = `#!/bin/bash
cd '${dir}'
ffmpeg -allowed_extensions ALL -protocol_whitelist file,http,crypto,tcp -i ${m3u8Name} '../${content_title}.mp4'`
  fs.writeFileSync(path.join(dir, 'ffmpeg.command'), commandStr)
  //fs.chmod()
  spawn('chmod', ['+x', 'ffmpeg.command'], { cwd: dir })
}
