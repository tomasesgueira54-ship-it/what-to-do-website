export interface ITranscriptSegment {
    time: string
    seconds: number
    speaker: string
    text: string
}

export interface IShowNote {
    time: string
    seconds: number
    description: string
}

export interface IRichEpisode {
    id: string
    title: string
    description: string
    duration?: string
    publishDate?: string
    audioUrl: string
    videoUrl?: string
    imageUrl?: string // Added missing property
    showNotes: IShowNote[]
    transcript: ITranscriptSegment[]
    guest?: {
        name: string
        bio: string
        links: { label: string, url: string }[]
        imageUrl?: string
    }
}

export const richEpisodesMap: Record<string, IRichEpisode> = {
    '1': {
        id: '1',
        title: 'Episódio #1 - Bem-vindos ao What To Do',
        description: 'Neste episódio de arranque, apresentamos o conceito do podcast, quem está por trás do microfone e o que pode esperar dos próximos episódios.',
        audioUrl: '/audio/episodio-1.mp3',
        videoUrl: 'https://www.youtube.com/watch?v=z99E2z8anFU',
        imageUrl: '/images/placeholder-card.svg',
        showNotes: [],
        transcript: []
    }
}

export const episodes = Object.values(richEpisodesMap);

