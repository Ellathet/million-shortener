import Link from 'next/link';
import { Button } from '../components/ui/button';

export default function NotFound() {
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
