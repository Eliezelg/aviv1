import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';

// Cette fonction est requise pour la génération statique avec des routes dynamiques
export function generateStaticParams() {
  // Définir les chemins de langue à pré-rendre
  return [
    { lang: 'fr' },
    { lang: 'en' },
    { lang: 'de' }
  ];
}

interface ContactPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: 'Contact - Villa Aviv',
    description: 'Contactez-nous pour plus d\'informations sur Villa Aviv',
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const dict = await getDictionary(params.lang);
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Nous contacter</h2>
          <p className="mb-6">
            Pour toute question concernant nos propriétés ou pour effectuer une réservation,
            n'hésitez pas à nous contacter par téléphone ou par email.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Adresse</h3>
              <p className="text-muted-foreground">
                Villa Aviv<br />
                123 Rue de la Paix<br />
                67430 Diemeringen, France
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Téléphone</h3>
              <p className="text-muted-foreground">+33 3 88 00 00 00</p>
            </div>
            
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">contact@villaaviv.com</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Formulaire de contact</h2>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full p-2 border rounded-md"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}