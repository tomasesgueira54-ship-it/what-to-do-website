import { redirect } from "next/navigation";

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  redirect(`/pt/blog/${params.id}`);
}
