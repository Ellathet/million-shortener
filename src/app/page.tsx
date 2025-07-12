'use client';

import z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ShortedUrl } from '../models/ShortedUrl';
import { Card, CardContent } from '../components/ui/card';
import { ExternalLink } from 'lucide-react';
import { getRelativeTime } from '../lib/luxon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setLoading] = React.useState(false);

  const schema = z.object({
    url: z.url('Please insert a valid URL'),
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
      try {
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
      } catch {
        toast.error('Error on shortening URL, please try again later');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [addUrl, copyValue],
  );

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    disabled: isLoading,
  });

  const [urls, setUrls] = React.useState<(ShortedUrl & { url: string })[]>([]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const storage = localStorage.getItem('urls');
      if (storage) {
        const parsedUrls = JSON.parse(storage) as (ShortedUrl & {
          url: string;
        })[];
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
          <div className="flex flex-col h-full overflow-y-auto p-2 mt-[4rem] pb-[4rem] hide-scrollbar">
            {urls &&
              urls.length > 0 &&
              urls.map((url) => (
                <Card
                  className="bg-[#14151486] border-[#383838] my-4"
                  key={url.url}
                >
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <h2
                        className="text-white font-semibold md:text-[16px] text-[14px]"
                        onClick={() => copyValue(url.url)}
                      >
                        {url.url}
                      </h2>
                      {url.createdAt && (
                        <small className="text-[12px] text-white/30 mt-[10px]">
                          Created at {getRelativeTime(url.createdAt)}
                        </small>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="hover:cursor-pointer bg-white text-[#141514] hover:bg-white/90"
                        onClick={() => copyValue(url.url)}
                      >
                        Copy
                      </Button>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link href={url.url} target="_blank">
                            <Button
                              variant="outline"
                              className="hover:cursor-pointer bg-white text-[#141514] hover:bg-white/90"
                            >
                              <ExternalLink />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{url.originalUrl}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
