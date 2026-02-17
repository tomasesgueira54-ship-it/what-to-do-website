import { ReactNode } from 'react'

type Messages = typeof import('@/messages/pt.json')

const messages: Record<string, Messages> = {
    pt: require('@/messages/pt.json'),
    en: require('@/messages/en.json'),
}

export function useTranslations(locale: string) {
    const translation = messages[locale] || messages.pt

    return (key: string, defaultValue?: string): string => {
        const keys = key.split('.')
        let value: any = translation

        for (const k of keys) {
            value = value?.[k]
        }

        return typeof value === 'string' ? value : (defaultValue || key)
    }
}

export function getTranslations(locale: string) {
    return messages[locale] || messages.pt
}
