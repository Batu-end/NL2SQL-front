import { redirect } from 'next/navigation';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  redirect('/chat');
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
