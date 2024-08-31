import dynamic from 'next/dynamic';

/*
  Render the names form on the client side to prevent hydration errors 
  due to reading persistent form data from sessionStorage.
*/
const Names = dynamic(() => import('./names').then(module => module.Names), {
  ssr: false,
});

export default function Page() {
  return <Names />;
}
