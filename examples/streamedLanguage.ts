import 'dotenv/config'
import { togetherClient, TogetherLanguageModel } from '../src/index'

const example = async (): Promise<void> => {
  try {
    const client = togetherClient({ apiKey: process.env.TOGETHER_API_KEY!, retryCooldowns: [] })

    const result = await client.language({
      model: TogetherLanguageModel.Falcon_40B,
      prompt: 'The capital of France is',
      streamCallback: v => console.log(v)
    })

    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error('an error occured')
    console.error(e)
  }
}

example()
