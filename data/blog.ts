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

// ============================================================
// TODO — IMAGENS DO BLOG  (substituir os ficheiros stub em public/images/)
//
// FICHEIROS NECESSÁRIOS (6 total):
//   1. blog-rooftop.jpg     — rooftop de Lisboa ao golden hour
//   2. blog-belem.jpg       — Belém ao pôr do sol
//   3. blog-markets.jpg     — mercado tradicional de Lisboa
//   4. blog-fado.jpg        — performance de fado numa tasca
//   5. blog-lisbon-72h.jpg  — panorâmica icónica de Lisboa
//   6. blog-nightlife.jpg   — Cais do Sodré / vida noturna  ← NOVO
//
// REGRAS GERAIS PARA TODAS AS FOTOS DO BLOG:
//   • Formato: JPG (qualidade 85-90), ou WebP
//   • Dimensões mínimas: 1200 × 630 px  (proporção 16:9 ideal para cards e OG)
//   • Modo de cor: RGB sRGB
//   • Tamanho máximo: 300 KB por ficheiro
//   • Não usar texto, logótipos ou marcas de água sobrepostos
//   • Boa luminosidade, sem fotos escuras ou granuladas
//   • Estilo editorial — ambiente real de Lisboa, não stock genérico
// ============================================================

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
        // TODO — FOTO: blog-rooftop.jpg
        //   Cena: Rooftop de Lisboa ao fim do dia / golden hour (17h-20h)
        //   Elementos obrigatórios: chaminés ou terraços com vista sobre os telhados da cidade;
        //     idealmente com o Rio Tejo visível ao fundo; luz quente/laranja de pôr do sol
        //   Sugestão de local: Park Bar (Bairro Alto), TOPO Martim Moniz, ou qualquer rooftop
        //     com vista panorâmica reconhecível de Lisboa
        //   Tom: Premium, aspiracional, luminoso, cores quentes
        //   O que EVITAR: interior de bar sem vista, noite fechada, ângulo de baixo
        imageUrl: "/images/blog-rooftop.jpg",
        categoryPt: "Lifestyle",
        categoryEn: "Lifestyle",
        contentPt: `Lisboa é uma cidade de contrastes, e poucos sítios o ilustram melhor do que os seus rooftops. De bairro em bairro, a cidade estende-se em ondas de telha laranja e branco-cal, criando um pano de fundo único para qualquer momento especial.

O **Park Bar**, em Bairro Alto, é provavelmente o mais icónico: funciona no telhado de um parque de estacionamento e tem uma vista desimpedida sobre o Tejo. Abre ao fim do dia e enche rapidamente ao fim de semana, por isso chega cedo.

O **TOPO**, no Chiado e no Martim Moniz, tem duas localizações com caráteres distintos. O de Martim Moniz fica sobre o Centro Comercial Mouraria e oferece uma vista sobre a Colina do Castelo que é simplesmente irresistível ao pôr do sol.

Para algo mais tranquilo e menos turístico, o **Hotel Memmo Alfama** tem um rooftop pequeno mas com uma vista sobre o rio e o Castelo que justifica qualquer espera. Ideal para um gin tónico e uma conversa longa.`,
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
        // TODO — FOTO: blog-belem.jpg
        //   Cena: Belém ao pôr do sol
        //   Elementos obrigatórios: Torre de Belém ou Mosteiro dos Jerónimos iluminados pela
        //     luz dourada do entardecer; ou vista do Tejo a partir dos Jardins de Belém com
        //     silhueta do Monumento às Descobertas
        //   Tom: Nostálgico, sereno, luz dourada intensa (hora mágica)
        //   Ângulo sugerido: horizontal, a partir de nível médio ou do chão
        //   O que EVITAR: multidões de turistas, luz de meio-dia, foto de postal clichê frontal
        imageUrl: "/images/blog-belem.jpg",
        categoryPt: "Roteiros",
        categoryEn: "Itineraries",
        contentPt: `Belém é um daqueles sítios que toda a gente conhece de nome mas poucos exploram como merece. Para além do Mosteiro dos Jerónimos e da Torre, existe uma Belém mais lenta e mais autêntica.

Comece pelos **Pastéis de Belém**. A fila vale sempre a pena, e um pastel de natá morno com canela e açúcar em pó é o melhor pequeno-almoço possível para uma manhã de visita.

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
            "Descobre os mercados tradicionais e a cultura local. Desde o Mercado da Ribeira até às Flores, estes espaços vibrantes refletem o autêntico espírito de Lisboa.",
        excerptEn:
            "Discover traditional markets and local culture. From Mercado da Ribeira to the Flower Market, these vibrant spaces reflect the authentic spirit of Lisbon.",
        readTime: "7 min",
        publishDate: "28 Feb 2026",
        // TODO — FOTO: blog-markets.jpg
        //   Cena: Mercado tradicional de Lisboa — ambiente vivo, colorido, com pessoas
        //   Elementos obrigatórios: bancas com fruta/legumes/flores coloridos em primeiro plano;
        //     OR interior do Mercado da Ribeira com luzes quentes e movimento;
        //     OR Mercado de Campo de Ourique com clientes ao balcão
        //   Tom: Caloroso, autêntico, local — cores vivas (verde, vermelho, amarelo das frutas)
        //   Ângulo sugerido: ligeiramente acima, capturando profundidade da banca
        //   O que EVITAR: mercado vazio, foto de supermercado moderno, sem elementos humanos
        imageUrl: "/images/blog-markets.jpg",
        categoryPt: "Cultura",
        categoryEn: "Culture",
        contentPt: `Os mercados tradicionais de Lisboa são muito mais do que sítios para comprar peixe e legumes. São espaços sociais, museus vivos da cultura urbana e, cada vez mais, destinos gastronómicos por direito próprio.

O **Mercado da Ribeira** (ou Time Out Market) foi o pioneiro da transformação. Hoje acolhe mais de 40 restaurantes e bares dentro do mesmo telhado, e é o sítio ideal para experimentar em poucos metros o que a gastronomia portuguesa tem de melhor.

O **Mercado de Campo de Ourique** é o favorito dos lisboetas. Mais tranquilo e menos turístico, tem uma energia de bairro que o distingue claramente dos outros. Ao domingo de manhã é quando está mais vivo.

Não esqueças o **Mercado das Flores**, na Rua da Assunção. Pequeno mas repleto de cor e de cheiro, é o antídoto perfeito para o ritmo acelerado da cidade. Uma visita de manhã cedo, quando as flores ainda têm orvalho fresco, é uma experiência que fica na memória.`,
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
        // TODO — FOTO: blog-fado.jpg
        //   Cena: Performance de fado numa tasca ou casa de fado típica
        //   Elementos obrigatórios: fadista a cantar (mulher de xaile negro, ou homem de fato escuro)
        //     com guitarrista português visível; iluminação de palco quente (âmbar/dourado);
        //     ambiente íntimo, sala pequena com mesas em segundo plano
        //   Tom: Intimista, emocional, dramático — alto contraste luz/sombra
        //   Ângulo sugerido: ligeiramente lateral, de nível, a capturar expressão facial
        //   O que EVITAR: palcos grandes de concerto, foto de grupo genérico, flash directo
        //   Alternativa aceitável: guitarra portuguesa em close-up sobre mesa de madeira rústica
        imageUrl: "/images/blog-fado.jpg",
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
        // TODO — FOTO: blog-lisbon-72h.jpg
        //   Cena: Vista aérea/panorâmica icónica de Lisboa que capture a essência da cidade toda
        //   Elementos obrigatórios: skyline de Lisboa com o Rio Tejo visível;
        //     idealmente do Miradouro da Graça, Castelo de São Jorge, ou vista de Santa Luzia;
        //     telhados de telha vermelha em primeiro plano com cidade ao fundo
        //   Tom: Grandioso, editorial, azul do céu ou luz de manhã cedo
        //   Ângulo sugerido: panorâmico horizontal, capturar a cidade em profundidade
        //   O que EVITAR: foto de dentro de museu, close-up de um só monumento, drone de noite
        imageUrl: "/images/blog-lisbon-72h.jpg",
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
    {
        id: "6",
        titlePt: "Cais do Sodré: O Bairro que Não Dorme",
        titleEn: "Cais do Sodré: The Neighbourhood That Never Sleeps",
        excerptPt:
            "Do mercado de peixe ao clube de jazz, Cais do Sodré é o bairro mais dinâmico de Lisboa de dia e de noite. Um guia completo para o explorar sem julgamentos.",
        excerptEn:
            "From fish market to jazz club, Cais do Sodré is Lisbon's most dynamic neighbourhood day and night. A complete guide to exploring it without prejudice.",
        readTime: "9 min",
        publishDate: "14 Feb 2026",
        // TODO — FOTO: blog-nightlife.jpg
        //   Cena: Cais do Sodré ou Bairro Alto ao anoitecer / início da noite (21h-23h)
        //   Elementos obrigatórios: rua estreita iluminada por luzes neom/quentes;
        //     pessoas em movimento desfocadas (longa exposição) ou grupo animado à porta de bar;
        //     atmosfera ur-bana, dinâmica, paleta de cores escura com pontos de luz quente
        //   Tom: Energético, cosmopolita, noturno — mas não escuro demais
        //   Ângulo sugerido: da rua para a fachada dos bares, ligeiramente contra-picaé
        //   O que EVITAR: interior de discoteca com flash, foto granulada, multidão ilegível
        //   Alternativa aceitável: Rua Cor-de-Rosa (Pink Street) com luz de neon rosado
        imageUrl: "/images/blog-nightlife.jpg",
        categoryPt: "Nightlife",
        categoryEn: "Nightlife",
        contentPt: `Cais do Sodré não é um bairro — é um estado de espírito. Durante décadas foi o bairro dos marinheiros e das pensiones de baixo preço, até que artistas, bares e restaurantes o redesenharam como o epicentro da vida noturna lisboeta.

Começa pela **Rua Cor-de-Rosa** (oficialmente Rua Nova do Carvalho), dé um passeio ao fim da tarde quando as esplanadas enchem e o neom cor-de-rosa pinta tudo de uma luz de filme. Aqui encontras desde tasquinhas com pão com chourico a cocktail bars de autor.

O **Mercado da Ribeira** fica mesmo ao lado e é a opção perfeita para jantar antes da noite. Com mais de 40 chefs debaixo do mesmo teto, consegues comer sushi, bacalhau, bifanas e sobremesas artesanais num raio de 50 metros.

Para música ao vivo, o **B.Leza** é o templo do jazz e das músicas africanas lusofónas. Noites de sexta-feira com kizomba, semba e jazz soão raras e imperdíveis. Chega cedo e fica até de madrugada — é assim que se faz.`,
        contentEn: `Cais do Sodré is not just a neighbourhood — it's a state of mind. For decades it was the district of sailors and cheap boarding houses, until artists, bars and restaurants reimagined it as the epicentre of Lisbon's nightlife.

Start on **Pink Street** (officially Rua Nova do Carvalho) in the late afternoon when the terraces fill up and the pink neon lights everything like a film set. Here you'll find everything from tasquinhas with bread and chouriço to craft cocktail bars.

**Mercado da Ribeira** is right next door and is the perfect option for dinner before the night begins. With over 40 chefs under the same roof, you can eat sushi, bacalhau, bifanas and artisan desserts within a 50-metre radius.

For live music, **B.Leza** is the temple of jazz and Lusophone African music. Friday nights with kizomba, semba and jazz are rare and unmissable. Arrive early and stay until the early hours — that's how it's done.`,
    },
];
