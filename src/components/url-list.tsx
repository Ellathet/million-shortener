import React, { useCallback } from 'react';
import { ShortedUrl } from '../models/ShortedUrl';
import { Card, CardContent } from './ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import Link from 'next/link';
import { getRelativeTime } from '../lib/luxon';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

export type ShortedUrlWithUrl = ShortedUrl & { url: string };

interface IURLListProps {
  items?: ShortedUrlWithUrl[];
}

export const URLList: React.FC<IURLListProps> = ({ items }) => {
  const copyValue = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('URL Copied to clipboard!');
  }, []);

  const shortUrl = useCallback((url: string) => {
    return url.length > 50 ? `${url.slice(0, 50)}...` : url;
  },[])

  return (
    <div className="flex flex-col h-full overflow-y-auto p-2 mt-[4rem] pb-[4rem] hide-scrollbar">
      {items &&
        items.length > 0 &&
        items.map((url) => (
          <Card className="bg-[#14151486] border-[#383838] my-2" key={url.url}>
            <CardContent className="flex justify-between items-center">
              <div className="flex flex-col">
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={url.url} target="_blank">
                      <h2
                        className="text-white font-semibold md:text-[16px] text-[14px]"
                        onClick={() => copyValue(url.url)}
                      >
                        {url.url}
                      </h2>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{shortUrl(url.originalUrl)}</p>
                  </TooltipContent>
                </Tooltip>

                {url.createdAt && (
                  <small className="text-[12px] text-white/30">
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
                    <p>{shortUrl(url.originalUrl)}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
