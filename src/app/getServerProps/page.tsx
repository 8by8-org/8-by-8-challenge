// app/yourpage/page.tsx
import { headers } from 'next/headers';


export default function YourPage() {
  // Use the headers() function to get the headers in a server-side component
  const headersList = headers();
  const host = headersList.get('url') || 'localhost:3000'; // Fallback to localhost

  console.log('Server-side host:', host);

  return (
    <div>
      <h1>Server-side host: {host}</h1>
      {/* Pass the host prop to Progress */}
    </div>
  );
}
