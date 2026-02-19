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

export interface Event {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    date: string; // ISO string
    endDate?: string; // optional ISO end date/time
    location: string;
    address?: string;
    image: string;
    source: EventSource;
    url: string;
    price?: string;
    category?: string;
    musicGenre?: string;
}
