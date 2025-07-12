import { redirect } from "next/navigation";
import { ShortedUrlEntity } from "../../models/ShortedUrl";

interface RedirectTemplateProps {
  params: { id: string }
}

// Turn this page into a SSR component makes able to use Serverless functions
// to redirect users to the original URL based on the shorted ID.
export default async function Page(props: RedirectTemplateProps) {
  const params = await props.params;
  const { id } = params;

  const shortUrl = await ShortedUrlEntity.findById(id);

  if(!shortUrl || !shortUrl.originalUrl) {
    return <div>Not Found Url</div>
  }

  redirect(shortUrl.originalUrl);
}