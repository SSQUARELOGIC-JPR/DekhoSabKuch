import { Category, Provider } from '../types/interfaces';

export const categories: Category[] = [
  { id: '1', name: 'Electrician', icon: 'flash' },
  { id: '2', name: 'Plumber', icon: 'water' },
  { id: '3', name: 'Salon', icon: 'cut' },
  { id: '4', name: 'AC Repair', icon: 'snow' },
  { id: '5', name: 'Carpenter', icon: 'hammer' },
  { id: '6', name: 'Painter', icon: 'color-palette' },
  { id: '7', name: 'Cleaning', icon: 'broom' },
  { id: '8', name: 'Pest Control', icon: 'bug' },
  { id: '9', name: 'Appliance Repair', icon: 'construct' },
  { id: '10', name: 'Beauty & Makeup', icon: 'brush' },
];

export const providers: Provider[] = [
  {
    id: 'p1',
    name: 'Ramesh Electric Works',
    category: 'Electrician',
    rating: 4.5,
    city: 'Jaipur',
  },
  {
    id: 'p2',
    name: 'PowerFix Electric',
    category: 'Electrician',
    rating: 4.3,
    city: 'Jaipur',
  },
  {
    id: 'p3',
    name: 'Sharma Plumbers',
    category: 'Plumber',
    rating: 4.2,
    city: 'Jaipur',
  },
  {
    id: 'p4',
    name: 'Quick Flow Plumbing',
    category: 'Plumber',
    rating: 4.6,
    city: 'Jaipur',
  },
  {
    id: 'p5',
    name: 'Modern Salon',
    category: 'Salon',
    rating: 4.8,
    city: 'Jaipur',
  },
  {
    id: 'p6',
    name: 'Royal Men Salon',
    category: 'Salon',
    rating: 4.4,
    city: 'Jaipur',
  },
  {
    id: 'p7',
    name: 'Cool Air AC Services',
    category: 'AC Repair',
    rating: 4.1,
    city: 'Jaipur',
  },
  {
    id: 'p8',
    name: 'Choudhary Carpenter Works',
    category: 'Carpenter',
    rating: 4.7,
    city: 'Jaipur',
  },
  {
    id: 'p9',
    name: 'Sparkle Home Cleaning',
    category: 'Cleaning',
    rating: 4.5,
    city: 'Jaipur',
  },
  {
    id: 'p10',
    name: 'Safe Pest Control',
    category: 'Pest Control',
    rating: 4.2,
    city: 'Jaipur',
  },
];