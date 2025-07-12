import { redirect } from 'next/navigation';
import { ShortedUrlEntity } from '../../models/ShortedUrl';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

interface RedirectTemplateProps {
  params: { id: string };
}

// Turn this page into a SSR component makes able to use Serverless functions
// to redirect users to the original URL based on the shorted ID.
export default async function Page(props: RedirectTemplateProps) {
  const params = await props.params;
  const { id } = params;

  const shortUrl = await ShortedUrlEntity.findById(id);

  if (!shortUrl || !shortUrl.originalUrl) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="text-center text-[95px] font-bold text-white">
          NOT FOUND
        </h1>
        <small className="text-[15px] text-white/30 mt-[-20px]">
          The URL you are trying to access does not exist or has been expired.
        </small>
        <Link href={'/'}>
          <Button
            variant="outline"
            className="hover:cursor-pointer bg-white text-[#141514] hover:bg-white/90 mt-10"
          >
            Short a new URL
          </Button>
        </Link>
      </div>
    );
  }

  redirect(shortUrl.originalUrl);
}
