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
    duration: string
    publishDate: string
    audioUrl: string
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
        duration: '45:30',
        publishDate: '15 Fev 2026',
        audioUrl: '/audio/episode-1.mp3',
        imageUrl: '/images/episode-1.jpg',
        guest: {
            name: 'Equipa What To Do',
            bio: 'A equipa fundadora do projeto, apaixonada por descobrir novas experiências.',
            links: [
                { label: 'Instagram', url: 'https://instagram.com/whattodo' },
                { label: 'Twitter', url: 'https://twitter.com/whattodo' }
            ]
        },
        showNotes: [
            { time: '00:00', seconds: 0, description: 'Introdução e boas-vindas' },
            { time: '05:30', seconds: 330, description: 'A história de como surgiu a ideia' },
            { time: '15:45', seconds: 945, description: 'O que esperar desta primeira temporada' },
            { time: '32:10', seconds: 1930, description: 'Perguntas e respostas rápidas' },
            { time: '44:00', seconds: 2640, description: 'Conclusão e despedida' }
        ],
        transcript: [
            { time: '00:00', seconds: 0, speaker: 'Host', text: 'Olá a todos e sejam muito bem-vindos ao primeiro episódio do What To Do!' },
            { time: '00:15', seconds: 15, speaker: 'Host', text: 'Hoje é um dia muito especial porque finalmente tiramos este projeto do papel.' },
            { time: '00:45', seconds: 45, speaker: 'Co-Host', text: 'É verdade! Foram meses de planeamento, cafés e imensas ideias trocadas.' },
            { time: '05:30', seconds: 330, speaker: 'Host', text: 'Tudo começou naquela viagem a Londres, lembra-te? Estávamos sem saber onde ir jantar.' },
            { time: '06:00', seconds: 360, speaker: 'Co-Host', text: 'Exatamente! E percebemos que faltava um guia que fosse mais pessoal, mais real.' }
        ]
    },
    '2': {
        id: '2',
        title: 'Episódio #2 - Produtividade e Rotinas',
        description: 'Conversamos sobre hábitos, consistência e estratégias práticas para organizar o dia e fazer mais com menos stress.',
        duration: '38:15',
        publishDate: '12 Fev 2026',
        audioUrl: '/audio/episode-2.mp3',
        imageUrl: '/images/episode-2.jpg',
        showNotes: [
            { time: '00:00', seconds: 0, description: 'Intro: Porquê produtividade?' },
            { time: '08:20', seconds: 500, description: 'A regra dos 2 minutos' },
            { time: '14:30', seconds: 870, description: 'Ferramentas digitais vs Papel' },
            { time: '28:15', seconds: 1695, description: 'Como dizer "não" ajuda a focar' }
        ],
        transcript: [
            { time: '00:00', seconds: 0, speaker: 'Host', text: 'Bem-vindos a mais um episódio. Hoje o tema é um dos meus favoritos: produtividade.' },
            { time: '01:20', seconds: 80, speaker: 'Host', text: 'Mas atenção, não é produtividade tóxica. É sobre ter tempo para o que importa.' },
            { time: '08:20', seconds: 500, speaker: 'Host', text: 'Vamos falar da regra dos 2 minutos. Se demora menos de 2 minutos, faz logo.' },
            { time: '08:45', seconds: 525, speaker: 'Co-Host', text: 'Isso mudou a minha vida. Deixei de acumular emails e loiça na pia!' }
        ]
    },
    '3': {
        id: '3',
        title: 'Episódio #3 - Viagens e Aventuras',
        description: 'Histórias de viagens, imprevistos pelo caminho e como essas experiências mudam a forma como vemos a vida.',
        duration: '52:20',
        publishDate: '9 Fev 2026',
        audioUrl: '/audio/episode-3.mp3',
        imageUrl: '/images/episode-3.jpg',
        showNotes: [
            { time: '00:00', seconds: 0, description: 'O bichinho das viagens' },
            { time: '10:15', seconds: 615, description: 'Perdidos em Tóquio' },
            { time: '25:40', seconds: 1540, description: 'Dicas para viajar leve (onebag)' },
            { time: '41:00', seconds: 2460, description: 'Próximos destinos na lista' }
        ],
        transcript: [
            { time: '00:00', seconds: 0, speaker: 'Host', text: 'Hoje vamos viajar sem sair do lugar. Apertem os cintos!' },
            { time: '10:15', seconds: 615, speaker: 'Convidado', text: 'Eu lembro-me perfeitamente, saí do metro e não fazia ideia onde estava. Tóquio é gigante.' },
            { time: '10:45', seconds: 645, speaker: 'Host', text: 'E sem internet? Como te orientaste?' },
            { time: '11:00', seconds: 660, speaker: 'Convidado', text: 'Perguntei a um local. A linguagem gestual funciona em todo o lado!' }
        ]
    }
}

export const episodes = Object.values(richEpisodesMap);

