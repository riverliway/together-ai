import 'dotenv/config'
import { togetherClient, TogetherImageModel } from '../src/index'

const example = async (): Promise<void> => {
  try {
    const client = togetherClient({ apiKey: process.env.TOGETHER_API_KEY! })

    const result = await client.inference({
      model: TogetherImageModel.Openjourney_v4,
      requestType: 'image-model-inference',
      prompt: 'a girl with pink hair and a blue skirt',
      width: 1024,
      height: 1024,
      seed: 9239,
      n: 1,
      steps: 20
    })

    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error(e)
  }
}

example()
