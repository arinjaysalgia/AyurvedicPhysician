export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Book Consultation',
    description: 'Share your story in a guided 45-minute consult.',
    icon: 'CalendarCheck',
  },
  {
    number: 2,
    title: 'Get Personalized Plan',
    description:
      'Receive a written Ayurvedic prescription & lifestyle blueprint.',
    icon: 'ClipboardList',
  },
  {
    number: 3,
    title: 'Follow the System',
    description:
      'Daily routines, herbs, diet, and check-ins designed for you.',
    icon: 'ListChecks',
  },
  {
    number: 4,
    title: 'Real Transformation',
    description: 'Track measurable progress month over month.',
    icon: 'TrendingUp',
  },
];
