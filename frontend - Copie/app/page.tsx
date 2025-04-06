import { redirect } from 'next/navigation';

export default function Home() {
  // Rediriger vers la langue par défaut (français)
  redirect('/fr');
  
  // Cette partie ne sera jamais exécutée en raison de la redirection
  return null;
}
