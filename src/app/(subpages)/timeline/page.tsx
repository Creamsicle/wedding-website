import Timeline from '@/components/Timeline';

const timelineItems = [
  {
    date: '2024 Q1',
    title: 'Project Kickoff',
    description: 'Initial planning and team assembly for the new venture.',
  },
  {
    date: '2024 Q2',
    title: 'Development Phase',
    description: 'Core features implementation and testing begins.',
  },
  {
    date: '2024 Q3',
    title: 'Beta Launch',
    description: 'First public beta release with early adopter feedback.',
  },
  {
    date: '2024 Q4',
    title: 'Market Release',
    description: 'Official product launch and marketing campaign.',
  },
];

export default function TimelinePage() {
  return (
    <div className="container mx-auto px-4 pt-32">
      <h1 className="text-4xl font-serif mb-8 text-center">Timeline Demo</h1>
      <Timeline items={timelineItems} />
    </div>
  );
} 