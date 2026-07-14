export interface FAQItem {
  question: string;
  answer: string;
}

export const faq: FAQItem[] = [
  {
    question: 'Is this a medicine, supplement, or exercise program?',
    answer:
      'No. This is a digital PDF guide focused on understanding the root causes of back pain and correcting daily habits. It is not a pharmaceutical product, supplement, or equipment-based program.',
  },
  {
    question: 'Will this work for chronic or long-term back pain?',
    answer:
      'Yes. The guide focuses on root-cause analysis rather than temporary relief. Whether your pain is recent or has persisted for years, the principles of spinal care and habit correction apply.',
  },
  {
    question: 'Do I need any equipment or special tools?',
    answer:
      'No. Everything in the guide integrates into your daily life without requiring additional purchases or special equipment.',
  },
  {
    question: 'Is this safe to follow?',
    answer:
      'Absolutely. This is educational content designed to help you make better daily choices for your spine. It does not replace medical advice for acute injuries or surgical conditions.',
  },
  {
    question: 'Will I get instant access after payment?',
    answer:
      'Yes. You will receive immediate PDF download access upon completing your payment through Razorpay.',
  },
];
