import { redirect } from 'next/navigation';

/**
 * Root route — redirect all visitors to /login.
 * The auth layout guard will redirect already-authenticated users to /chat.
 */
export default function HomePage() {
  redirect('/login');
}