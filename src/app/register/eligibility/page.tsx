import dynamic from 'next/dynamic';

/*
  Render the eligibility form on the client side to prevent hydration errors 
  due to reading persistent form data from sessionStorage.
*/
const Eligibility = dynamic(
  () => import('./eligibility').then(module => module.Eligibility),
  {
    ssr: false,
  },
);

export default function Page() {
  return <Eligibility />;
}
