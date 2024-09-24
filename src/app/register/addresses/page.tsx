import dynamic from 'next/dynamic';

/*
  Render the addresses form on the client side to prevent hydration errors 
  due to reading persistent form data from sessionStorage.
*/
const Addresses = dynamic(
  () => import('./addresses').then(module => module.Addresses),
  {
    ssr: false,
  },
);

export default function Page() {
  return <Addresses />;
}
