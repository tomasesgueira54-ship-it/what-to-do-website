export type EventSource =
    | 'Agenda LX'
    | 'Fever'
    | 'Shotgun'
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
    | 'Discoteca/Nightlife'
    | 'Festa'
    | 'Workshop'
    | 'Ao Ar Livre'
    | 'Outro';

export type MusicGenre =
    | 'Fado'
    | 'Rock'
    | 'Jazz'
    | 'Pop'
    | 'Techno'
    | 'Hard Techno'
    | 'Trance'
    | 'House'
    | 'Funk'
    | 'Clássico'
    | 'Reggae'
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
    image: string;
    source: EventSource;
    url: string; // External Application URL
    price?: string;
    category?: EventCategory;
    musicGenre?: MusicGenre;
}
