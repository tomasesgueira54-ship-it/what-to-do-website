export interface BlogPost {
    id: string;
    titlePt: string;
    titleEn: string;
    excerptPt: string;
    excerptEn: string;
    contentPt?: string;
    contentEn?: string;
    readTime: string;
    publishDate: string;
    imageUrl: string;
    categoryPt: string;
    categoryEn: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        titlePt: "Top 5 Rooftops em Lisboa para este Verão",
        titleEn: "Top 5 Lisbon Rooftops for Summer",
        excerptPt:
            "As melhores vistas da cidade acompanhadas de cocktails incríveis. Descobre os rooftops mais procurados de Lisboa com ambiente sofisticado e vista de 360 graus.",
        excerptEn:
            "The best city views paired with incredible cocktails. Discover Lisbon's most sought-after rooftops with sophisticated atmosphere and 360-degree views.",
        readTime: "5 min",
        publishDate: "10 Mar 2026",
        imageUrl: "/images/placeholder-card.svg",
        categoryPt: "Lifestyle",
        categoryEn: "Lifestyle",
        contentPt: `Lisboa é uma cidade de contrastes, e poucos sítios o ilustram melhor do que os seus rooftops. De bairro em bairro, a cidade estende-se em ondas de telha laranja e branco-cal, criando um pano de fundo único para qualquer momento especial.

O **Park Bar**, em Bairro Alto, é provavelmente o mais icónico: funciona no telhado de um parque de estacionamento e tem uma vista desimpedida sobre o Tejo. Abre ao fim do dia e enche rapidamente ao fim de semana, por isso chega cedo.

O **TOPO**, no Chiado e no Martim Moniz, tem duas localizações com caráteres distintos. O de Martim Moniz fica sobre o Centro Comercial Mouraria e oferece uma vista sobre a Colina do Castelo que é simplesmente irresistível ao pôr do sol.

Para algo mais tranquilo e menos turístico, o **Hotel Memmo Alfama** tem um rooftop pequeno mas com uma vista sobre o rio e o Castelo que justifica qualquer espera. Ideal para um gin tónico e uma conversa lonça.`,
        contentEn: `Lisbon is a city of contrasts, and few settings illustrate this better than its rooftops. From neighbourhood to neighbourhood, the city unfolds in waves of terracotta tiles and whitewashed walls, creating a unique backdrop for any special moment.

**Park Bar** in Bairro Alto is probably the most iconic: it sits on the roof of a car park and has an unobstructed view of the Tagus river. It opens in the evenings and fills up fast on weekends, so arrive early.

**TOPO**, with locations in Chiado and Martim Moniz, has two distinct personalities. The Martim Moniz spot sits above the Mouraria shopping centre and offers a view of the Castle Hill that is simply irresistible at sunset.

For something quieter and less touristy, **Hotel Memmo Alfama** has a small rooftop with a view of the river and the Castle that makes any wait worthwhile. Perfect for a gin and tonic and a long conversation.`,
    },
    {
        id: "2",
        titlePt: "Explorar Belém ao Pôr do Sol",
        titleEn: "Exploring Belém at Sunset",
        excerptPt:
            "Um guia completo para aproveitar uma das zonas mais bonitas de Lisboa. Visita os monumentos históricos, os restaurantes tradicionais e os cafés acolhedores de Belém antes do anoitecer.",
        excerptEn:
            "A complete guide to enjoying one of Lisbon's most beautiful areas. Visit historic monuments, traditional restaurants and cozy cafés in Belém before sunset.",
        readTime: "8 min",
        publishDate: "05 Mar 2026",
        imageUrl: "/images/placeholder-card.svg",
        categoryPt: "Roteiros",
        categoryEn: "Itineraries",
        contentPt: `Belém é um daqueles sítios que toda a gente conhece de nome mas poucos exploram como merece. Para além do Mosteiro dos Jerónimos e da Torre, existe uma Belém mais lenta e mais autêntica.

Comece pela **Pastelería de Belém**. A fila vale sempre a pena, e um pastel de natá morno com canela e açúcar em pó é o melhor pequeno-almoço possível para uma manhã de visita.

Depois, explore a Rua Vieira Portuense em direção ao rio. Esta zona junto ao Tejo, especialmente ao fim da tarde, transforma-se numa galeria ao ar livre com o sol a pintar tudo de laranja e o cheiro a sal no ar.

O pôr do sol a partir dos **Jardins de Belém** é um dos momentos mais fotogénicos da cidade. Leve um piquenique, um livro, ou simplesmente sente-se e deixe o tempo passar. Belém à noite, com a Torre iluminada e quase sem turistas, é outro mundo.`,
        contentEn: `Belém is one of those places everyone knows by name but few explore as it deserves. Beyond the Jerónimos Monastery and the Tower, there is a slower, more authentic Belém waiting to be discovered.

Start at **Pastéis de Belém**. The queue is always worth it, and a warm custard tart with cinnamon and powdered sugar is the best possible breakfast for a morning visit.

Then explore Rua Vieira Portuense towards the river. This riverfront area, especially in the late afternoon, becomes an open-air gallery with the sun painting everything orange and the smell of salt in the air.

Sunset from the **Belém Gardens** is one of the city's most photogenic moments. Bring a picnic, a book, or simply sit and let time pass. Belém at night, with the illuminated Tower and almost no tourists, is a different world entirely.`,
    },
    {
        id: "3",
        titlePt: "Mercados Tradicionais: A Alma de Lisboa",
        titleEn: "Traditional Markets: The Soul of Lisbon",
        excerptPt:
            "Descobre os mercados tradicionais e a cultura local. Desde o Mercado da Ribeira até às Flores, estes espaços vibrant refletem o autêntico espírito de Lisboa.",
        excerptEn:
            "Discover traditional markets and local culture. From Mercado da Ribeira to the Flower Market, these vibrant spaces reflect the authentic spirit of Lisbon.",
        readTime: "7 min",
        publishDate: "28 Feb 2026",
        imageUrl: "/images/placeholder-card.svg",
        categoryPt: "Cultura",
        categoryEn: "Culture",
        contentPt: `Os mercados tradicionais de Lisboa são muito mais do que sítios para comprar peixe e legumes. São espaços sociais, museus vivos da cultura urbana e, cada vez mais, destinos gastronómicos por direito próprio.

O **Mercado da Ribeira** (ou Time Out Market) foi o pioneiro da transformação. Hoje acolhe mais de 40 restaurantes e bares dentro do mesmo telhado, e é o sítio ideal para experimentar em poucos metros o que a gastronomia portuguesa tem de melhor.

O **Mercado de Campo de Ourique** é o favorito dos lisboetas. Mais tranquilo e menos turístico, tem uma energia de bairro que o distingue claramente dos outros. Ao domingo de manhã é quando está mais vivo.

Não esquerças o **Mercado das Flores**, na Rua da Assunção. Pequeno mas repleto de cor e de cheiro, é o antidote perfeito para o ritmo acelerado da cidade. Uma visita de manhã cedo, quando as flores ainda têm orâvio fresco, é uma experiência que fica na memória.`,
        contentEn: `Lisbon's traditional markets are far more than places to buy fish and vegetables. They are social spaces, living museums of urban culture and, increasingly, gastronomic destinations in their own right.

**Mercado da Ribeira** (or Time Out Market) was the pioneer of the transformation. Today it hosts over 40 restaurants and bars under the same roof, and is the ideal place to experience, within just a few metres, what Portuguese cuisine has to offer.

**Mercado de Campo de Ourique** is the favourite of Lisbon locals. Quieter and less touristy, it has a neighbourhood energy that clearly distinguishes it from the others. Sunday morning is when it's most alive.

Don't forget the **Flower Market**, on Rua da Assunção. Small but full of colour and scent, it's the perfect antidote to the city's fast pace. An early morning visit, when the flowers still have fresh dew, is an experience that stays with you.`,
    },
    {
        id: "4",
        titlePt: "Fado: A Experiência Musical Portuguesa",
        titleEn: "Fado: The Portuguese Musical Experience",
        excerptPt:
            "Compreende o significado do fado, a música tradicional portuguesa que toca a alma. Aprende onde encontrar as melhores casas de fado de Lisboa.",
        excerptEn:
            "Understand the meaning of fado, the traditional Portuguese music that touches the soul. Learn where to find the best fado houses in Lisbon.",
        readTime: "6 min",
        publishDate: "22 Feb 2026",
        imageUrl: "/images/placeholder-card.svg",
        categoryPt: "Música",
        categoryEn: "Music",
        contentPt: `O fado é muito mais do que música. É uma filosofia de vida, uma forma de estar no mundo que só os portugueses conseguem verdadeiramente descrever. A palavra "saudade" é a chave que abre a porta a este universo.

Para uma primeira experiência autêntica, evita os recintos turísticos da Alfama e vai até ao **Tasca do Chico**, no Bairro Alto. Com apenas 30 lugares e uma lista de espera de dias, este é o templo onde o fado acontece como deve ser: íntimo, improvisado e arrepiante.

A **Casa de Fado e da Guitarra Portuguesa**, no Largo do Chafariz de Dentro, é o melhor museu para perceber a história do fado antes de o ouvir ao vivo. A entrada é acessível e a exposição é surpreendentemente rica.

Alguns nomes essenciais para ouvir antes de qualquer visita: Amália Rodrigues (o alicerce de tudo), Carlos do Carmo, Mariza e, mais recentemente, Caétano Veloso — que, sendo brasileiro, é talvez o embaixador mais inesperado do lado mais internacional do fado.`,
        contentEn: `Fado is much more than music. It is a philosophy of life, a way of being in the world that only the Portuguese can truly describe. The word "saudade" is the key that opens the door to this universe.

For a first authentic experience, avoid the tourist venues in Alfama and go to **Tasca do Chico** in Bairro Alto. With only 30 seats and a waiting list of days, this is the temple where fado happens as it should: intimate, improvised and spine-chilling.

**Casa do Fado e da Guitarra Portuguesa**, in Largo do Chafariz de Dentro, is the best museum for understanding the history of fado before hearing it live. Entry is affordable and the exhibition is surprisingly rich.

Some essential names to listen to before any visit: Amália Rodrigues (the foundation of everything), Carlos do Carmo, Mariza, and more recently Caetano Veloso — who, being Brazilian, is perhaps the most unexpected ambassador of fado's international dimension.`,
    },
    {
        id: "5",
        titlePt: "Guia do Viajante: 72 Horas em Lisboa",
        titleEn: "Traveler's Guide: 72 Hours in Lisbon",
        excerptPt:
            "Um itinerário perfeito para aproveitar ao máximo um fim de semana em Lisboa. Museus, gastronomia, passeios à beira-rio e muito mais.",
        excerptEn:
            "A perfect itinerary to make the most of a weekend in Lisbon. Museums, gastronomy, riverside walks and much more.",
        readTime: "12 min",
        publishDate: "18 Feb 2026",
        imageUrl: "/images/placeholder-card.svg",
        categoryPt: "Guias",
        categoryEn: "Guides",
        contentPt: `72 horas em Lisboa é tempo suficiente para perceber porque esta cidade vicia quem a visita. Este é o itinerário testado e aprovado pela nossa equipa para um fim de semana perfeito.

**Sexta-feira à noite**: Chega 16h. Check-in e imediatamente para o Bairro Alto ou LX Factory (se for depois das 18h). Jantar no Taberna da Rua das Flores ou, para algo mais descontraído, no Zé da Mouraria. Depois, obrigatoriamente, um copo no Crédito Prédio de Lisboa.

**Sábado**: Manhã em Belém (Jerónimos + Pasteis, inevitável). Tarde no MAAT ou na Costa da Caparica se o sol aparecer. Jantar e noite em Santo António — percorre a Rua da Esperança e arredores até encontrar um sítio que chame.

**Domingo**: Mercado de Campo de Ourique ao almoço. Rua Augusta a passear. Subida ao Castelo de São Jorge para a última vista da cidade. Parte com saudade — é assim que se sabe que a viagem foi bem passada.`,
        contentEn: `72 hours in Lisbon is enough time to understand why this city captivates everyone who visits. This is the itinerary tested and approved by our team for a perfect weekend.

**Friday evening**: Arrive at 4pm. Check in and immediately head to Bairro Alto or LX Factory (if it's after 6pm). Dinner at Taberna da Rua das Flores or, for something more casual, Zé da Mouraria. Afterwards, a mandatory drink at Crédito Prédio de Lisboa.

**Saturday**: Morning in Belém (Jerónimos + custard tarts, inevitable). Afternoon at MAAT or Costa da Caparica if the sun shows up. Dinner and evening in Santo António — walk down Rua da Esperança and surrounding streets until something calls to you.

**Sunday**: Mercado de Campo de Ourique for lunch. A stroll down Rua Augusta. Climb to São Jorge Castle for a final view of the city. Leave with saudade — that's how you know the trip was well spent.`,
    },
];
