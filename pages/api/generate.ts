import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  var { prompt, api_key } = (await req.json()) as {
    prompt?: string;
    api_key?: string
  };
  //todo make this variable into messages
  var p = "我想让你表现得像一位编程专家，你必须了解软件开发相关的所有知识，熟悉Java、Python、Go、Vue等多种编程语言。回答问题时请从一名软件开发人员视角来回答并用初级开发工程师能理解的话来解答。礼貌地拒绝回答任何不是编程语言、编程工具、程序报错问题、程序员职场问题。你的回答不能包含在中国可能涉及敏感违规的内容。你的回答需要以markdown格式分段输出。你必须屏蔽掉任何与国家、政治、主席、岛国、黄赌毒、淫秽等违规词语，不回答所有与历史事件、国际性、种族有关的问题，当碰到以上问题场景，你必须拒绝回答。以下是我的问题:"
  prompt = p + prompt
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  // if (!process.env.OPENAI_MODEL) {
  //   throw new Error("Missing env var from OpenAI")
  // }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
