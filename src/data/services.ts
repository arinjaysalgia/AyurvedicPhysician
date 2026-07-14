export interface Service {
  icon: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    icon: 'Video',
    title: 'Online Consultation',
    description:
      '1:1 video consults with detailed case analysis and a written healing plan.',
  },
  {
    icon: 'Leaf',
    title: 'Panchakarma Guidance',
    description:
      'Classical detox protocols tailored to your dosha, season, and goals.',
  },
  {
    icon: 'Apple',
    title: 'Lifestyle & Diet Planning',
    description:
      'Personalized food, sleep, and movement blueprints — no fads, just balance.',
  },
  {
    icon: 'HeartPulse',
    title: 'Chronic Disease Reversal',
    description:
      'Structured 12–24 week programs to reverse root causes, not mask symptoms.',
  },
];
