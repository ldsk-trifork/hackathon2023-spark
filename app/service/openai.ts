import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function completion(prompt: string, maxTokens: number) {
    const completion = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: maxTokens
    });

    return completion.choices[0].text;
}
