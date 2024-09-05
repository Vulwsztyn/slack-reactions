import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.TOKEN
const alphabets = process.env.ALPHABETS.split(',')
const shouldUseRandom = process.env.RANDOM === '1'
const channelName = process.argv[2]
const text = process.argv[3]
const reactions = process.argv[4]

const randomSample = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

async function main() {
  const letterCounts = reactions.split('').reduce((acc, letter) => {
    const count = acc[letter] || 0
    return {
      ...acc,
      [letter]: count + 1,
    }
  }, {})
  const maxCount = Math.max(...Object.values(letterCounts))
  if (maxCount > alphabets.length) {
    console.log('You can only use each reaction twice')
    process.exit(1)
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

//   const channelsResponse = await axios.post('https://slack.com/api/conversations.list', {}, config)
//   console.log(JSON.stringify(channelsResponse.data, null, 2))
//   // const channel = channelsResponse.data.channels.find(channel => channel.name === channelName)
  const channelId = channelName
  console.log({ channelId })
  const messages = (
    await axios.post(
      'https://slack.com/api/conversations.history',
      {
        channel: channelId,
      },
      config,
    )
  ).data.messages
  console.log({ messagesLen: messages.length })
  console.log(messages.map((m) => m.text.slice(0, 10)))
  console.log({ text })
  const regex = new RegExp(`${text}`, 'i')
  const message = messages.find((m) => m.text.match(regex))
  console.log(messages.map((m) => m.text.match(regex)))
  console.log({ message })
  const used = {}
  for (const reaction of reactions) {
    const usedAlphabets = used[reaction] || []
    const alphabet = shouldUseRandom
      ? randomSample(alphabets.filter((alphabet) => !usedAlphabets.includes(alphabet)))
      : alphabets.find((alphabet) => !usedAlphabets.includes(alphabet))
    const name = alphabet.replace('$', reaction)
    const response = await axios.post(
      'https://slack.com/api/reactions.add',
      {
        channel: channelId,
        name,
        timestamp: message.ts,
      },
      config,
    )
    used[reaction] = [...usedAlphabets, alphabet]
  }
}

main()
