import { redirect } from "next/navigation";

export default function EventPage({ params }: { params: { id: string } }) {
  redirect(`/pt/events/${params.id}`);
}
