export interface SamplePortrait {
  id: string;
  name: string;
  gender: string;
  description: string;
  url: string;
}

export const SAMPLE_PORTRAITS: SamplePortrait[] = [
  {
    id: 'sample-1',
    name: 'Elena',
    gender: 'Female',
    description: 'Frontal portrait with natural light & gentle smile',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-2',
    name: 'Marcus',
    gender: 'Male',
    description: 'Direct gaze with soft studio lighting',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-3',
    name: 'Aoi',
    gender: 'Female',
    description: 'Clean portrait with friendly expression',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-4',
    name: 'Devon',
    gender: 'Male',
    description: 'Warm natural smile with clear lighting',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-5',
    name: 'Soraya',
    gender: 'Female',
    description: 'Classic close-up portrait with dark curls',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-6',
    name: 'Kenji',
    gender: 'Male',
    description: 'Thoughtful pose with defined jawline',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  },
];
