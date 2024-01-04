import { render } from '@felixrydberg/discord-markdown'

export const createNewsSummary = (body: string) => {
    try {
        const html = render(body).replaceAll(/<[^>]*>.*<\/[^>]*>(?:<br>)?/g, '')
        const paragraph = html.split('<br>')[0]
        return paragraph.substring(0, 511);
    } catch(error: any) {
        console.error(error);
    }
}