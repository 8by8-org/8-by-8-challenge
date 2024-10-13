import dynamic from 'next/dynamic';

const Share = dynamic(() => import('./share').then(module => module.Share), {
  ssr: false,
});

export default function Page() {
  return <Share />;
}
