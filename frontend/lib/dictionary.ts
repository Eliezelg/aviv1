import 'server-only';

interface Dictionary {
  common: {
    back_to_home: string;
    loading: string;
    error: string;
    success: string;
  };
  navbar: {
    home: string;
    properties: string;
    gallery: string;
    contact: string;
    my_reservations: string;
    the_villa: string;
    rooms: string;
    amenities: string;
    activities: string;
  };
  property: {
    available: string;
    unavailable: string;
    capacity: string;
    price_per_night: string;
    description: string;
    amenities: string;
    book_now: string;
    view_details: string;
    no_properties: string;
    no_properties_desc: string;
    special_requests: string;
    nights: string;
    persons: string;
    total_price: string;
    deposit: string;
    paid: string;
    pending: string;
  };
  reservation: {
    book_property: string;
    complete_form: string;
    reservation_details: string;
    dates: string;
    guests: string;
    confirmation_code: string;
    reservation_confirmed: string;
    payment_failed: string;
    reservation_pending: string;
    confirmed_description: string;
    failed_description: string;
    pending_description: string;
    reference: string;
    status: {
      pending: string;
      confirmed: string;
      cancelled: string;
      completed: string;
    };
    email_sent: string;
    pay_deposit: string;
    view_my_reservations: string;
    back_to_home: string;
    cancel_reservation: string;
    reservation_cancelled: string;
    reservation_cancelled_desc: string;
  };
  guest_access: {
    title: string;
    description: string;
    email: string;
    email_hint: string;
    confirmation_code: string;
    code_hint: string;
    access_button: string;
    no_reservations: string;
    no_reservations_desc: string;
    reservations_for: string;
    logout: string;
  };
  gallery: {
    title: string;
    description: string;
    images: Array<{
      thumbnail: string;
      full: string;
      alt: string;
    }>;
  };
}

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  // Fallback to 'fr' if the locale is not supported
  const lang = locale in dictionaries ? locale : 'fr';
  
  try {
    return dictionaries[lang]();
  } catch (error) {
    console.error(`Error loading dictionary for locale: ${lang}`, error);
    // Fallback to French dictionary if there's an error
    return dictionaries.fr();
  }
}