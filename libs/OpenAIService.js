import OpenAI from 'openai';
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export class OpenAIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
        });
    }
    /* 
        GET RESPONSE BY STREAM
            but right now it is not a stream
        @param conversation: Array of objects
        @return response: Object contains chunks of response
    */
    async getAnswerByStream(conversation) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: conversation,
                stream: true,
                temperature: 0.3,
                top_p: 0.9,
                max_tokens: 1500,
            });
            console.log(response);
            return response;
        } catch (err) {
            console.log("In OPENAI services: ", err);
        }finally {
            console.log("FINISHED");
        }
    }

    
    /*
        GET RESPONSE BY COMPLETIONS
        @param conversation: Array of objects
        @return response: Object contains only one response object
    */
    async getAnswerByCompletions(conversation) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: conversation,
                temperature: 0.3,
                top_p: 0.9,
                max_tokens: 1500,
            });
            console.log(response);
            return response;
        } catch (err) {
            console.log(err);
        }finally {
            console.log("FINISHED");
        }
    }

    //create thread
    async createThread() {
        try {
            const thread = await this.openai.threads.create();
            return thread;
        } catch (err) {
            console.log(err);
        }
    }
}
