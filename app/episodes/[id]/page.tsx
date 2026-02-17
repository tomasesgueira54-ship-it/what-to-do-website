import { redirect } from 'next/navigation'

interface EpisodePageProps {
  params: {
    id: string
  }
}

export default function EpisodePage({ params }: EpisodePageProps) {
  redirect(`/pt/episodes/${params.id}`)
}
