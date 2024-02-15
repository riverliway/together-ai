import 'dotenv/config'
import { togetherClient, TogetherChatModel } from '../src/index'

const example = async (): Promise<void> => {
  try {
    const client = togetherClient({ apiKey: process.env.TOGETHER_API_KEY!, retryCooldowns: [] })

    const result = await client.chat({
      model: TogetherChatModel.LLaMA_2_Chat_70B,
      messages: [{
        role: 'user',
        content: 'Hello, how are you?'
      }],
      streamCallback: v => console.log(JSON.stringify(v, null, 2)),
      n: 2
    })

    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error('an error occured')
    console.error(e)
  }
}

example()
