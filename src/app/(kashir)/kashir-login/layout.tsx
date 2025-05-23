// app/admin/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionid');


  if (token) {
    redirect('/kashir'); // redirect if not logged in
  }

  return (
  <>
    {children}
  </>
  );
}
