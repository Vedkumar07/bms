import { client } from '@repo/db/client';

export default async function Home() {
  const user = (await client.user.findFirst()) as { username?: string; password?: string } | null;

  return (
    <div>
      <p>Username: {user?.username ?? 'No user found'}</p>
      <p>Password: {user?.password ?? 'No user found'}</p>
    </div>
  );
}
