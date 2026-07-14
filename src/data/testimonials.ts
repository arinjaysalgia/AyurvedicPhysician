export interface Testimonial {
  quote: string;
  name: string;
  descriptor: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'I came in exhausted with PCOS and irregular cycles. In four months my reports normalised and my energy is back. Dr. Pradnya truly listens.',
    name: 'Anjali M.',
    descriptor: 'Office Worker, Pune',
    rating: 5,
  },
  {
    quote:
      'Years of acidity and bloating gone — without harsh medicines. The diet plan finally fit my real kitchen and my family.',
    name: 'Sushma R.',
    descriptor: 'Homemaker, Bengaluru',
    rating: 5,
  },
  {
    quote:
      'My anxiety used to control me. The daily routine she designed gave me back my focus and sleep. I feel like myself again.',
    name: 'Rohan S.',
    descriptor: 'Engineering Student',
    rating: 5,
  },
];
