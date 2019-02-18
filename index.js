const config = require('config')
const fs = require('fs-extra')
const Twitter = require('twitter')

const client = new Twitter({
  consumer_key: config.get('ck'),
  consumer_secret: config.get('cs'),
  access_token_key: config.get('tk'),
  access_token_secret: config.get('ts')
})

const list = fs.readFileSync('list.txt', 'utf8').split('\n')
  .filter(line => line !== '')
  .filter(line => !line.startsWith('#'))

  async function loop() {
    const followers = await Promise.all(list.map(async screen_name => {
      const user = await client.get('users/show', { screen_name: screen_name });
      return user.followers_count
    }))
    const time = Math.floor( new Date().getTime() / 1000 )
    console.log(`${time},${followers.join(',')}`)
    fs.appendFile('output.csv', `${time},${followers.join(',')}\n`)
  }

fs.pathExists('output.csv')
  .then(exists => {
    if(!exists) {
      console.log(`time,${list.join(',')}`)
      fs.appendFile('output.csv', `time,${list.join(',')}\n`)
    }
    setInterval(loop, 1000 * 60 * 15)
    loop()
  })