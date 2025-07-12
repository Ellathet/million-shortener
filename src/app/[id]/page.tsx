import { notFound, redirect } from 'next/navigation';
import { ShortedUrlEntity } from '../../models/ShortedUrl';

// Turn this page into a SSR component makes able to use Serverless functions
// to redirect users to the original URL based on the shorted ID.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const shortUrl = await ShortedUrlEntity.findById(id);

  if (!shortUrl || !shortUrl.originalUrl) {
    return notFound()
  }

  redirect(shortUrl.originalUrl);
}
