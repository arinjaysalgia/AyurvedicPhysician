export interface Condition {
  name: string;
  icon: string;
}

export const conditions: Condition[] = [
  { name: 'PCOS', icon: 'Circle' },
  { name: 'Diabetes', icon: 'Droplets' },
  { name: 'Thyroid', icon: 'Activity' },
  { name: 'Obesity', icon: 'Scale' },
  { name: 'Digestive Disorders', icon: 'Stethoscope' },
  { name: 'Stress & Anxiety', icon: 'Brain' },
];
