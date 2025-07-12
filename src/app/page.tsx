'use client';

import z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [isLoading, setLoading] = React.useState(false);

  const schema = z.object({
    url: z.url('Please insert a valid URL'),
  });

  type SchemaData = z.infer<typeof schema>;

  const copyValue = useCallback((value: string) => {
    navigator.clipboard.writeText(value)
  }, [])

  const shortenUrl = useCallback(async (data: SchemaData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/short', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const responseData = await response.json()

      if(responseData.error) {
        throw new Error(responseData.error);
      }

      copyValue(responseData.url);
      toast.success('URL shortened successfully! Copied to clipboard');
    } catch {
      toast.error('Error on shortening URL, please try again later');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  },[copyValue])

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    disabled: isLoading,
  });

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-[70px] font-bold mb-10 text-white">Shortener</h1>
        <form
          onSubmit={handleSubmit(shortenUrl)}
          className="md:w-[50%] w-[80%] flex gap-2 bg-[#141514] rounded-lg border py-2 pr-2 items-center border-[#383838] shadow-lg"
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
      </div>
    </main>
  );
}
