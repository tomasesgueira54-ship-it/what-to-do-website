export type EventSource =
    | 'Agenda LX'
    | 'Fever'
    | 'Shotgun'
    | 'Xceed'
    | 'Ticketline'
    | 'Eventbrite'
    | 'Meetup'
    | 'Blueticket'
    | 'BOL';

export type EventCategory =
    | 'Teatro'
    | 'Música'
    | 'Cinema'
    | 'Dança'
    | 'Exposição'
    | 'Conferência'
    | 'Mercado/Feira'
    | 'Gastronomia'
    | 'Discoteca/Nightlife'
    | 'Festa'
    | 'Workshop'
    | 'Ao Ar Livre'
    | 'Outro';

export type MusicGenre =
    | 'Fado'
    | 'Rock'
    | 'Metal'
    | 'Punk'
    | 'Indie/Alternative'
    | 'Jazz'
    | 'Pop'
    | 'Techno'
    | 'Melodic Techno'
    | 'Industrial Techno'
    | 'Minimal'
    | 'Acid'
    | 'Hard Techno'
    | 'Trance'
    | 'Psytrance'
    | 'Goa'
    | 'House'
    | 'Deep House'
    | 'Tech House'
    | 'Progressive House'
    | 'Afro House'
    | 'Melodic House'
    | 'Electro'
    | 'Breakbeat'
    | 'Drum & Bass'
    | 'Dubstep'
    | 'UK Garage'
    | 'Hardstyle'
    | 'Disco'
    | 'Downtempo/Chill'
    | 'Funk'
    | 'R&B/Soul'
    | 'Clássico'
    | 'Reggae'
    | 'Afrobeats'
    | 'World/Latin'
    | 'Hip-Hop'
    | 'Folk/Tradicional'
    | 'Samba/Carnaval'
    | 'K-Pop'
    | 'Experimental'
    | 'Outro';

export interface Event {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    date: string; // ISO string 2023-10-27T19:00:00.000Z
    endDate?: string; // optional ISO end date/time
    location: string;
    address?: string;
    lat?: number;
    lng?: number;
    image: string;
    source: EventSource;
    url: string; // External Application URL
    price?: string;
    category?: EventCategory;
    musicGenre?: MusicGenre;
}
