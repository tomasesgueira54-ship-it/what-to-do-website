export interface BlogPost {
    id: string;
    titlePt: string;
    titleEn: string;
    excerptPt: string;
    excerptEn: string;
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
        imageUrl: "/images/blog-rooftop.jpg",
        categoryPt: "Lifestyle",
        categoryEn: "Lifestyle",
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
        imageUrl: "/images/blog-belem.jpg",
        categoryPt: "Roteiros",
        categoryEn: "Itineraries",
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
        imageUrl: "/images/blog-markets.jpg",
        categoryPt: "Cultura",
        categoryEn: "Culture",
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
        imageUrl: "/images/blog-fado.jpg",
        categoryPt: "Música",
        categoryEn: "Music",
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
        imageUrl: "/images/blog-lisbon-72h.jpg",
        categoryPt: "Guias",
        categoryEn: "Guides",
    },
];
