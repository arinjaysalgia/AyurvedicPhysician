export interface Credential {
  icon: string;
  label: string;
  title: string;
  description: string;
}

export const credentials: Credential[] = [
  {
    icon: 'Award',
    label: 'University Topper',
    title: 'Gold Medalist',
    description: 'Gold medalist in Ayurvedic medicine.',
  },
  {
    icon: 'Leaf',
    label: 'Panchakarma Specialist',
    title: 'Detox Expert',
    description: 'Advanced classical detox training.',
  },
  {
    icon: 'GraduationCap',
    label: 'Research Scientist',
    title: 'PhD Clinical Ayurveda',
    description: 'PhD in clinical Ayurveda research.',
  },
  {
    icon: 'HeartPulse',
    label: 'Reversal Expert',
    title: 'Chronic Disease Specialist',
    description: 'Specialist in chronic disease reversal.',
  },
];

export const stats = [
  { value: '12+', label: 'Years Experience' },
  { value: '5000+', label: 'Patients Treated' },
  { value: 'Gold', label: 'Medalist' },
];
