// app/admin/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionid'); 

  if (!token) {
    redirect('/kashir-login'); // redirect if not logged in
  }

  return (
    <html>
      <body>
        <nav>Admin Panel</nav>
        {children}
      </body>
    </html>
  );
}
