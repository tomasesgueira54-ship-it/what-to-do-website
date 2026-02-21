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
    flashcards?: { question: string; answer: string }[]
    longDescription?: string;
    mindMapUrl?: string; // URL da imagem do mind map
    comparisonTable?: {
        title?: string;
        headers: string[];
        rows: string[][];
    };
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
        title: 'Rooftops em Lisboa: onde ver o melhor sunset da cidade',
        description: 'Neste episódio inaugural exploramos os rooftops mais icónicos de Lisboa e mostramos onde apanhar o pôr‑do‑sol que te vai roubar o fôlego. Vamos além da vista: partilhamos dicas internas, horários secretos e o tom informal que faz da What To Do a voz da cidade.',
        publishDate: '20 de Fevereiro, 2026',
        duration: '35 min',
        audioUrl: '/podcasts/audio/os-melhores-rooftops-de-lisboa-sem-armadilhas.m4a',
        // videoUrl: 'https://www.youtube.com/watch?v=z99E2z8anFU', (disabled)
        imageUrl: '/podcasts/images/podcast-1-launch.png',
        mindMapUrl: '/podcasts/images/mindmap-rooftops.svg',
        longDescription: `## Para lá do Postal: O Guia Real dos Rooftops de Lisboa

Lisboa é um ecossistema vibrante onde o tradicional e o vanguardista se cruzam em cada esquina, da Graça ao Cais do Sodré. Neste episódio vamos além do postal turístico e focamos no que realmente interessa para quem vive a cidade.

Aqui o objetivo é papo direto: sem filtros, sem exageros e com dicas práticas para escolher rooftops com base no teu mood — seja para relaxar, criar conteúdo, sair à noite ou ter uma experiência premium.

Falamos de timing, da luz dourada de fim de tarde, do tipo de música, da vista real (sem ilusões) e dos detalhes que fazem diferença: reservas, dress code, vento, preços e lotação.

Também desmontamos clichés sobre Lisboa para te ajudar a evitar armadilhas turísticas e escolher spots que entregam mesmo a experiência prometida.

Se queres uma regra simples: chega 30-40 minutos antes do sunset, confirma o menu antes de ir e escolhe o rooftop pelo tipo de noite que queres ter — não só pela fama no Instagram.`,
        comparisonTable: {
            headers: ['Tipo de Rooftop', 'Vibe', 'Onde encontrar (Exemplos)', 'Melhor para...'],
            rows: [
                ['Local Chill', 'Descontraído, música ambiente, conversa fácil.', 'Topo do Martim Moniz, Park, Lost In.', 'Pós-trabalho, dates tranquilos, ler um livro.'],
                ['Instagramável', 'Focado na estética, neons, plantas, spots para fotos.', 'Java, Mama Shelter, Lumi.', 'Criar conteúdo, impressionar visitas, fotos de grupo.'],
                ['Festa / Sunset', 'DJ sets, volume alto, energia, dança.', 'Ferroviário, Monsantos, IDB Lisbon.', 'Sair à noite, aniversários, ver o pôr-do-sol com animação.'],
                ['Vista Brutal', 'Premium, focado na paisagem 360º, serviço de mesa.', 'SEEN, Verride, Rossio Gastrobar.', 'Ocasiões especiais, jantar romântico, impressionar.']
            ]
        },
        showNotes: [
            { time: '01:30', seconds: 90, description: 'O "Tom de Bar" como Padrão de Ouro: Comunicação sem filtros.' },
            { time: '05:45', seconds: 345, description: 'A Anatomia de um Episódio Viciante: Porquê os 30 Minutos?' },
            { time: '12:20', seconds: 740, description: 'Storytelling Sensorial e a Realidade Verificável.' },
            { time: '18:10', seconds: 1090, description: 'Pro-Tips: A Linha que Separa o Especialista do Amador.' },
            { time: '24:00', seconds: 1440, description: 'Desmistificar Lisboa: O segmento "Inside Lisboa".' },
            { time: '28:30', seconds: 1710, description: 'Curadoria com Inteligência Emocional.' },
            { time: '32:15', seconds: 1935, description: 'Ecossistema Digital: Converter Ouvintes em Comunidade.' },
        ],
        transcript: [
            { time: '00:00', seconds: 0, speaker: 'Host', text: 'Lisboa é, hoje, um ecossistema vibrante onde o tradicional e o vanguardista chocam em cada esquina, da Graça ao Cais do Sodré.' },
            { time: '01:00', seconds: 60, speaker: 'Host', text: 'O nosso público foge do jornalismo de revista de bordo; eles procuram a verdade dita olhos nos olhos.' },
            { time: '05:00', seconds: 300, speaker: 'Host', text: 'Nós chamamos a isto de "papo direto", sem barreiras. Estilo conversa de bar entre amigos que sabem do que falam.' },
            { time: '12:00', seconds: 720, speaker: 'Host', text: 'Quando descrevemos um rooftop, não falamos apenas da carta de cocktails. Falamos daquela luz dourada de fim de tarde que só Lisboa tem.' },
            { time: '18:00', seconds: 1080, speaker: 'Host', text: 'Uma recomendação What To Do diz: vai na terça-feira, pede a mesa ao fundo e evita chegar depois das 20h.' },
            { time: '24:00', seconds: 1440, speaker: 'Host', text: 'Confirmar ou desmentir clichés sobre a movida alfacinha constrói um vínculo de confiança que o marketing tradicional não consegue comprar.' },
            { time: '36:00', seconds: 2160, speaker: 'Host', text: 'Lisboa está cheia de gente a falar para turistas. Quando é que foi a última vez que sentiu que alguém estava, realmente, a falar para si?' }
        ],
        flashcards: [
            { question: 'Qual a principal característica de um rooftop do tipo "Local Chill"?', answer: 'Ambiente propício à conversa com música em volume baixo.' },
            { question: 'Para que tipo de ocasião é ideal um rooftop "Local Chill"?', answer: 'Pós-trabalho ou um date mais tranquilo.' },
            { question: 'Qual o melhor horário para chegar a um rooftop "Local Chill" para garantir lugar?', answer: 'Entre 30 a 40 minutos antes do pôr-do-sol.' },
            { question: 'O que procurar num rooftop se o objetivo for tirar fotografias de qualidade para redes sociais?', answer: 'Vista direta para o Tejo, pontes, castelo ou miradouros.' },
            { question: 'Que elementos decorativos costumam definir um rooftop "Instagramável"?', answer: 'Neons, plantas, puffs e detalhes fotogénicos.' },
            { question: 'Qual a vantagem de chegar a um spot fotográfico antes da "golden hour"?', answer: 'Garantir luz suave para as fotos antes do pôr-do-sol.' },
            { question: 'Qual o foco principal de um rooftop do tipo "Festa"?', answer: 'Dançar, socializar e ter uma experiência de mini-festa ao ar livre.' },
            { question: 'Que tipo de bebidas são comuns em rooftops focados em "Festa"?', answer: 'Cocktails, shots e baldes de bebidas.' },
            { question: 'O que se deve verificar antecipadamente num rooftop de festa para evitar ser barrado?', answer: 'A existência de guestlist ou consumo mínimo obrigatório.' },
            { question: 'Qual a recomendação do guia para evitar imprevistos em rooftops de festa muito cheios?', answer: 'Combinar antecipadamente um "plano B" com o grupo.' },
            { question: 'O que define um rooftop de "Vista Brutal"?', answer: 'Um horizonte aberto com vista ampla para o rio, pontes ou castelo.' },
            { question: 'Para que tipo de momentos é mais indicado o rooftop de "Vista Brutal"?', answer: 'Momentos românticos, introspectivos ou contemplação de paisagem.' },
            { question: 'Qual a postura recomendada ao visitar um rooftop de "Vista Brutal"?', answer: 'Permanecer com tempo, bebendo devagar e deixando o tempo passar.' },
            { question: 'Como se pode confirmar se um rooftop é excessivamente caro antes de o visitar?', answer: 'Consultar as cartas e menus online no site ou no Google Maps.' },
            { question: 'Qual o preço de referência para cocktails que indica um rooftop de gama alta (caro)?', answer: 'Preços que começam nos 14 ou 15 euros.' },
            { question: 'Que fator climático de Lisboa exige levar sempre um agasalho para um rooftop?', answer: 'A ocorrência frequente de vento, mesmo no verão.' },
            { question: 'O que deve ser verificado nas reviews sobre o conforto de um rooftop exposto?', answer: 'Se o local disponibiliza aquecedores exteriores ou mantas.' },
            { question: 'Em que períodos é considerada "altamente recomendada" a reserva de mesa?', answer: 'Sextas, sábados e sunsets durante o verão.' },
            { question: 'Que tipo de rooftop é sugerido para quem quer ler ou trabalhar um pouco sozinho?', answer: 'Rooftops do tipo "Local Chill" ou focados na vista.' },
            { question: 'Qual é a regra geral de dress code para a maioria dos rooftops em Lisboa?', answer: 'Casual arrumado (sapatilhas limpas e t-shirt simples).' },
            { question: 'Que tipos de vestuário devem ser evitados em rooftops de hotéis mais exigentes?', answer: 'Chinelos e roupa demasiado desportiva.' },
            { question: 'Qual a vantagem de chegar cedo a um rooftop que não aceita reservas?', answer: 'Evitar as filas de espera e o pico de enchente.' },
            { question: 'O que procurar num rooftop para garantir uma conversa confortável sem ruído excessivo?', answer: 'Música mais baixa e cadeiras confortáveis.' },
            { question: 'Qual o risco de escolher um rooftop apenas pela fama sem pesquisar o mood?', answer: 'Encontrar filas longas, preços altos e ambiente desadequado ao objetivo.' },
            { question: 'Que tipo de rooftop é ideal para levar quem visita Lisboa pela primeira vez?', answer: 'Rooftops "Instagramáveis" ou de "Vista Brutal".' },
            { question: 'Como identificar um rooftop que privilegia o público local e o convívio?', answer: 'Preços razoáveis e música que não obriga a gritar.' },
            { question: '"O que se pretende evitar ao procurar um rooftop de "Vista Brutal"?', answer: 'Estar encurralado entre prédios muito altos que bloqueiam o horizonte.' },
            { question: 'Qual a importância de verificar a presença de DJs ou live acts antes de ir?', answer: 'Perceber se o ambiente será de festa/energia alta ou mais calmo.' },
            { question: 'Que estratégia ajuda a observar a mudança de luz da cidade sem pressa?', answer: 'Chegar cerca de 40 minutos antes do pôr-do-sol.' },
            { question: 'O que deve definir a escolha do rooftop ideal segundo o guia?', answer: 'O "match" entre o mood pretendido para a noite e a vibe do espaço.' },
            { question: 'Qual o benefício de consultar menus online em termos de orçamento?', answer: 'Identificar se existem opções acessíveis como copos de vinho ou cerveja.' },
            { question: 'Como o guia descreve a evolução da oferta de rooftops em Lisboa?', answer: 'Passou de poucos espaços para quase um em cada bairro.' },
            { question: 'O que procurar num rooftop para garantir que o grupo consegue dançar?', answer: 'Bom sistema de som e espaço adequado para socializar em pé.' },
            { question: 'Qual o critério de seleção para um date romântico num rooftop?', answer: 'Escolher um ambiente tranquilo, sem estética de discoteca.' },
            { question: '"Que tipo de conteúdo visual é privilegiado nos rooftops "Instagramáveis"?', answer: 'Fotografias de grupo e reels com vistas de cartão-postal.' },
            { question: 'Por que razão o guia sugere sapatilhas limpas para o dress code?', answer: 'Para manter um aspeto cuidado sem perder a componente casual.' },
            { question: 'Qual o impacto de música muito alta num rooftop focado em conversa?', answer: 'Dificulta a interação e obriga as pessoas a gritar.' },
            { question: '"O que caracteriza a "poluição visual" num contexto de rooftops?', answer: 'A presença de obstáculos ou prédios que impedem a vista ampla da cidade.' },
            { question: 'Como lidar com a lotação esgotada em rooftops de festa ao fim de semana?', answer: 'Chegar cedo ao local ou utilizar a guestlist.' },
            { question: 'Qual a utilidade de observar fotos do espaço em redes sociais antes de ir?', answer: 'Identificar se existem spots específicos para fotos sem pessoas a passar à frente.' },
            { question: 'Que tipo de rooftop é mais indicado para quem quer apenas contemplar o Tejo?', answer: 'Rooftop com "Vista Brutal" e horizonte aberto.' },
            { question: '"O que o guia sugere fazer se a dúvida for "o que fazer em Lisboa"?', answer: 'Consultar ou perguntar ao "What To Do".' },
            { question: 'Qual o objetivo de verificar se o rooftop tem decoração pensada com neons?', answer: 'Garantir que o sítio tem estética apelativa para conteúdos digitais.' },
            { question: 'Porque é que o guia recomenda sapatos fechados em vez de chinelos à noite?', answer: 'Para cumprir normas de dress code mais exigentes em hotéis ou locais premium.' },
            { question: 'Como evitar pagar preços excessivos por cocktails de baixa qualidade?', answer: 'Verificar reviews que mencionem a relação qualidade-preço das bebidas.' },
            { question: '"Qual a melhor forma de descrever o rooftop "Vista Brutal" para um turista?', answer: 'Um local para ver a cidade de cima em modo contemplativo.' },
            { question: 'Que detalhe logístico deve ser confirmado para eventos de grupo ou aniversários?', answer: 'A possibilidade de reserva e as condições de consumo mínimo.' },
            { question: '"O que esperar de um rooftop focado em criadores de conteúdo?', answer: 'Muitos spots fotogénicos e vistas para os principais monumentos.' },
            { question: 'Qual o conselho para quem quer ver o pôr-do-sol sem a confusão do pico de enchente?', answer: 'Chegar cedo para garantir mesa e assistir à transição da luz.' },
            { question: 'Como se define o sucesso de um final de tarde num rooftop em Lisboa?', answer: 'Escolher o sítio certo para o tipo de noite pretendida, evitando filas e gastos inúteis.' },
        ]
    }
}

export const episodes = Object.values(richEpisodesMap);

