import 'dotenv/config'
import { togetherClient, TogetherChatModel } from '../src/index'

const example = async (): Promise<void> => {
  try {
    const client = togetherClient({ apiKey: process.env.TOGETHER_API_KEY!, retryCooldowns: [] })

    const result = await client.chat({
      model: TogetherChatModel.Deepseek_Coder_Instruct_33B,
      messages: [{
        role: 'user',
        content: 'Hello, how are you?'
      }]
    })

    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error('an error occured')
    console.error(e)
  }
}

example()
