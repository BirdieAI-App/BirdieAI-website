import OpenAI from 'openai';

export class OpenAIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
        });
        this.config = {
            model: "gpt-4o",
            temperature: 0.3,
            top_p: 0.9,
            max_tokens: 2500,
        }
    }

    /*
        GET RESPONSE BY COMPLETIONS
        @param conversation: Array of objects
        @return response: Object contains only one response object
    */
    async getResponse(conversation) {
        console.log(conversation)
        try {
            const response = await this.openai.chat.completions.create({
                ...this.config,
                messages: conversation,
            });
            return response;
        } catch (err) {
            console.log(err.message);
        }
    }

    //create thread
    async createThread() {
        try {
            const thread = await this.openai.beta.threads.create();
            return thread;
        } catch (err) {
            console.log(err);
        }
    }
}
