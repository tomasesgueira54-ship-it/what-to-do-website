function normalizeText(value?: string): string {
    return String(value || '').trim();
}

function hasDescriptionHint(description: string, type: 'price' | 'location'): boolean {
    const text = normalizeText(description).toLowerCase();
    if (!text) return false;

    if (type === 'price') {
        return /pre[cç]o|price|valor|cost|gratuit|gr[aá]tis|free|ticket|bilhete/i.test(text);
    }

    return /local|location|morada|venue|onde|address|mapa|maps/i.test(text);
}

function confirmationMessage(isPt: boolean, type: 'price' | 'location'): string {
    if (isPt) {
        return type === 'price' ? 'A confirmar' : 'Verificar descrição';
    }

    return type === 'price' ? 'TBD' : 'See description';
}

function isUnknownPrice(value?: string): boolean {
    const text = normalizeText(value).toLowerCase();
    if (!text) return true;

    return (
        text === 'check site'
        || text.includes('indispon')
        || text.includes('unavailable')
        || text.includes('a confirmar')
        || text.includes('to be confirmed')
    );
}

function isUnknownLocation(value?: string): boolean {
    const text = normalizeText(value).toLowerCase();
    if (!text) return true;

    return (
        text === 'unknown'
        || text === 'n/a'
        || text.includes('indispon')
        || text.includes('unavailable')
        || text.includes('a confirmar')
        || text.includes('to be confirmed')
    );
}

export function getDisplayPrice(price: string | undefined, description: string | undefined, isPt: boolean): string {
    if (!isUnknownPrice(price)) {
        return normalizeText(price);
    }

    return confirmationMessage(isPt, 'price');
}

export function getDisplayLocation(location: string | undefined, description: string | undefined, isPt: boolean): string {
    if (!isUnknownLocation(location)) {
        return normalizeText(location);
    }

    return confirmationMessage(isPt, 'location');
}
