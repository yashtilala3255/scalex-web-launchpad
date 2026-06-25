import {
  Palette,
  FlaskConical,
  Megaphone,
  Users,
  Building,
  User,
} from 'lucide-react';
import { FeatureGrid } from '@/components/ui/feature-section';

// Demo data for the categories
const featureCategories = [
  {
    icon: <Palette size={24} />,
    title: 'Creators',
    items: [
      { text: 'Sell products online' },
      { text: 'Grow your newsletter' },
      { text: 'Receive contact form messages' },
    ],
  },
  {
    icon: <FlaskConical size={24} />,
    title: 'Product',
    items: [
      { text: 'Gather audience feedback' },
      { text: 'Receive feature requests' },
      { text: 'Conduct user research', href: '#' },
    ],
  },
  {
    icon: <Megaphone size={24} />,
    title: 'Marketing',
    items: [
      { text: 'Generate leads' },
      { text: 'Register users' },
      { text: 'Measure customer satisfaction' },
    ],
  },
  {
    icon: <Users size={24} />,
    title: 'HR',
    items: [
      { text: 'Evaluate employee engagement' },
      { text: 'Receive job applications' },
      { text: 'Create exit surveys' },
    ],
  },
  {
    icon: <Building size={24} />,
    title: 'Office',
    items: [
      { text: 'Organize team events' },
      { text: 'Receive help desk tickets' },
      { text: 'Collect internal suggestions' },
    ],
  },
  {
    icon: <User size={24} />,
    title: 'Personal',
    items: [
      { text: 'Create an online quiz' },
      { text: 'Send an RSVP form' },
      { text: 'Organize a volunteer signup' },
    ],
  },
];

export default function FeatureGridDemo() {
  return (
    <div className="bg-background w-full">
      <FeatureGrid
        title={
          <>
            Designed{' '}
            <span className="relative inline-block">
              for you
              <svg
                viewBox="0 0 120 6"
                className="absolute left-0 bottom-0 -mb-1 w-full"
                aria-hidden="true"
              >
                <path
                  d="M1 4.5C25.46 1.63 78.43 1.39 119 4.5"
                  stroke="#f472b6" // pink-400
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>
          </>
        }
        subtitle="Start from scratch or explore templates created by our community."
        illustrationSrc="https://tally.so/images/demo/v2/designed-for-you.png"
        categories={featureCategories}
        buttonText="Browse templates"
        buttonHref="#"
      />
    </div>
  );
}
