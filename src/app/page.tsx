'use client';

import z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { createRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ShortedUrl } from '../models/ShortedUrl';
import ReCAPTCHA from 'react-google-recaptcha';
import { ShortedUrlWithUrl, URLList } from '../components/url-list';

export default function Home() {
  const recaptchaRef = createRef<ReCAPTCHA>();
  const [isLoading, setLoading] = React.useState(false);

  const schema = z.object({
    url: z.url('Please insert a valid URL'),
    token: z.string().nullable().optional(),
  });

  type SchemaData = z.infer<typeof schema>;

  const copyValue = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('URL Copied to clipboard!');
  }, []);

  const addUrl = useCallback((data: ShortedUrl & { url: string }) => {
    setUrls((self) => [
      ...self,
      {
        originalUrl: data.originalUrl,
        url: data.url,
        createdAt: data.createdAt,
        expiredAt: data.expiredAt,
      },
    ]);

    if (typeof window !== undefined) {
      const storage = localStorage.getItem('urls');
      const parsedUrls = storage
        ? JSON.parse(storage)
        : ([] as (ShortedUrl & {
            url: string;
          })[]);

      localStorage.setItem(
        'urls',
        JSON.stringify([
          ...parsedUrls,
          {
            originalUrl: data.originalUrl,
            url: data.url,
            createdAt: data.createdAt,
            expiredAt: data.expiredAt,
          },
        ]),
      );
    }
  }, []);

  const shortenUrl = useCallback(
    async (data: SchemaData) => {
      setLoading(true);
      let token: string | null = null;

      try {
        if (recaptchaRef.current && process.env.NODE_ENV === 'production') {
          token = await recaptchaRef.current.executeAsync();
          data.token = token;
        }

        const response = await fetch('/api/short', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();

        if (responseData.error) {
          throw new Error(responseData.error);
        }

        addUrl(responseData);
        copyValue(responseData.url);

        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      } catch {
        toast.error('Error on shortening URL, please try again later');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [addUrl, copyValue, recaptchaRef],
  );

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    disabled: isLoading,
  });

  const [urls, setUrls] = React.useState<ShortedUrlWithUrl[]>([]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const storage = localStorage.getItem('urls');
      if (storage) {
        const parsedUrls = JSON.parse(storage) as ShortedUrlWithUrl[];
        setUrls(parsedUrls);
      }
    }
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-[70px] font-bold mb-10 text-white">Shortener</h1>
        <form
          onSubmit={handleSubmit(shortenUrl)}
          className="lg:w-[50%] md:w-[70%] w-[80%] flex gap-2 bg-[#141514] rounded-lg border py-2 pr-2 items-center border-[#383838] shadow-lg"
        >
          <Input
            className="h-[45px] border-none outline-none focus:ring-0! focus:ring-offset-0! text-white placeholder:font-semibold"
            placeholder="Enter your URL"
            {...register('url')}
            disabled={isLoading}
          />
          <Button
            variant="default"
            className="hover:cursor-pointer bg-white text-[#141514] hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? 'Shortening...' : 'Shorten'}
          </Button>
          {(process.env.NODE_ENV === 'production' ||
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) && (
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              theme="dark"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              className="hidden"
            />
          )}
        </form>
        {errors.url ? (
          <small className="text-[15px] text-[#ee4646] mt-5">
            {errors.url.message}
          </small>
        ) : (
          <small className="text-[15px] text-white/30 mt-5">
            Fast way to scale your URL to million
          </small>
        )}
        <div className="lg:w-[40%] md:w-[70%] w-[80%] h-[40vh] fixed bottom-0">
          <URLList items={urls} />
        </div>
      </div>
    </main>
  );
}
