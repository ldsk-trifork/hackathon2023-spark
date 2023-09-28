import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function completion(prompt: string, maxResponseTokens: number) {
    const completion = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: maxResponseTokens
    });

    return completion.choices[0].text;
}

export type Message = {
    role: 'system' | 'user',
    content: string
}

export async function chat(messages: Message[], maxResponseTokens: number) {
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: maxResponseTokens
    });

    return completion.choices[0].message.content || '';
}
