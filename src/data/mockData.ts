import { TrendingNews, StartupIdea } from '../types';

export const mockTrendingNews: TrendingNews[] = [
  {
    id: '1',
    title: 'OpenAI Introduces New Multimodal AI Assistant with Voice Recognition',
    source: 'TechCrunch',
    url: '#',
    category: 'AI',
    publishedAt: '2025-01-16T08:30:00Z',
    summary: 'New breakthrough in conversational AI with enhanced voice understanding capabilities.',
    trendScore: 95
  },
  {
    id: '2',
    title: 'Remote Work Productivity Tools See 300% Surge in Enterprise Adoption',
    source: 'Venture Beat',
    url: '#',
    category: 'SaaS',
    publishedAt: '2025-01-16T07:15:00Z',
    summary: 'Companies investing heavily in digital collaboration platforms post-pandemic.',
    trendScore: 88
  },
  {
    id: '3',
    title: 'Carbon Capture Startups Raise $2.1B in Q1 2025',
    source: 'Bloomberg',
    url: '#',
    category: 'Climate',
    publishedAt: '2025-01-16T06:45:00Z',
    summary: 'Climate tech funding reaches new heights as governments mandate carbon reduction.',
    trendScore: 92
  },
  {
    id: '4',
    title: 'Wearable Health Monitors Now Track Mental Wellness Indicators',
    source: 'The Verge',
    url: '#',
    category: 'Health',
    publishedAt: '2025-01-16T05:20:00Z',
    summary: 'Next-gen wearables incorporate stress, mood, and cognitive health tracking.',
    trendScore: 86
  },
  {
    id: '5',
    title: 'DeFi Protocols Integrate Traditional Banking Services',
    source: 'CoinDesk',
    url: '#',
    category: 'Crypto',
    publishedAt: '2025-01-16T04:30:00Z',
    summary: 'Bridge between traditional finance and decentralized protocols gaining traction.',
    trendScore: 81
  },
  {
    id: '6',
    title: 'Quantum Computing Breakthrough Promises 1000x Speed Improvement',
    source: 'Wired',
    url: '#',
    category: 'Hardware',
    publishedAt: '2025-01-16T03:45:00Z',
    summary: 'New quantum processor architecture could revolutionize computing power.',
    trendScore: 97
  }
];

export const mockStartupIdeas: StartupIdea[] = [
  {
    id: '1',
    idea: 'AI-powered voice assistant specifically for elderly care, providing medication reminders and emergency detection',
    category: 'AI + Health',
    basedOn: ['OpenAI Multimodal AI', 'Wearable Health Monitors'],
    confidence: 92,
    marketSize: 'Large',
    difficulty: 'Medium',
    generatedAt: '2025-01-16T09:00:00Z',
    saved: false
  },
  {
    id: '2',
    idea: 'Remote team productivity platform with built-in carbon footprint tracking for distributed companies',
    category: 'SaaS + Climate',
    basedOn: ['Remote Work Tools Surge', 'Carbon Capture Funding'],
    confidence: 88,
    marketSize: 'Medium',
    difficulty: 'Low',
    generatedAt: '2025-01-16T09:00:00Z',
    saved: true
  },
  {
    id: '3',
    idea: 'DeFi-powered healthcare savings accounts with automated wellness incentive payments',
    category: 'Crypto + Health',
    basedOn: ['DeFi Banking Integration', 'Mental Wellness Tracking'],
    confidence: 76,
    marketSize: 'Large',
    difficulty: 'High',
    generatedAt: '2025-01-16T09:00:00Z',
    saved: false
  },
  {
    id: '4',
    idea: 'Quantum-enhanced climate modeling SaaS for corporations to optimize carbon reduction strategies',
    category: 'Hardware + Climate',
    basedOn: ['Quantum Computing Breakthrough', 'Carbon Capture Funding'],
    confidence: 85,
    marketSize: 'Medium',
    difficulty: 'High',
    generatedAt: '2025-01-16T09:00:00Z',
    saved: false
  },
  {
    id: '5',
    idea: 'Voice-controlled mental health companion app with real-time mood analysis and intervention',
    category: 'AI + Health',
    basedOn: ['Multimodal AI Assistant', 'Mental Wellness Tracking'],
    confidence: 90,
    marketSize: 'Large',
    difficulty: 'Medium',
    generatedAt: '2025-01-16T09:00:00Z',
    saved: true
  }
];