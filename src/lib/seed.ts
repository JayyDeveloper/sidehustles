import type { Hustle } from '../types/schema';
import { hustleDB } from './db';
import { generateId } from './utils';

/**
 * Sample seed data for development and testing
 */
export const sampleHustles: Omit<Hustle, 'id' | 'order'>[] = [
  {
    name: 'Freelance Web Design',
    status: 'active',
    description: 'Creating modern, responsive websites for small businesses and startups',
    priority: 'high',
    tags: ['web', 'design', 'freelance'],
    notes: [
      {
        id: generateId(),
        content: '# Client Requirements\n\n- Responsive design\n- SEO optimized\n- Fast loading times',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        content: 'Meeting with potential client on Friday at 2 PM',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    resources: [
      {
        id: generateId(),
        title: 'Figma Design System',
        url: 'https://www.figma.com',
        description: 'Main design tool for prototyping',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        title: 'Tailwind CSS Documentation',
        url: 'https://tailwindcss.com',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    transactions: [
      {
        id: generateId(),
        amount: 2500,
        type: 'income',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        note: 'Payment from ABC Corp website project',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        amount: 49,
        type: 'expense',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        note: 'Figma Pro subscription',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        amount: 1800,
        type: 'income',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        note: 'XYZ Startup landing page',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    activityLog: [
      {
        id: generateId(),
        type: 'created',
        description: 'Hustle "Freelance Web Design" created',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        type: 'transaction_added',
        description: 'income of $2500 added',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { amount: 2500, type: 'income' },
      },
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'Online Course Creation',
    status: 'active',
    description: 'Teaching web development fundamentals through video courses',
    priority: 'medium',
    tags: ['education', 'video', 'passive-income'],
    notes: [
      {
        id: generateId(),
        content: '## Course Outline\n\n1. HTML Basics\n2. CSS Fundamentals\n3. JavaScript Essentials\n4. Building Projects',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    resources: [
      {
        id: generateId(),
        title: 'Udemy Course Platform',
        url: 'https://www.udemy.com',
        description: 'Main platform for hosting courses',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    transactions: [
      {
        id: generateId(),
        amount: 450,
        type: 'income',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        note: 'Course sales - January',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        amount: 200,
        type: 'investment',
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        note: 'Video editing software',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    activityLog: [
      {
        id: generateId(),
        type: 'created',
        description: 'Hustle "Online Course Creation" created',
        timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'Mobile App Development',
    status: 'future',
    description: 'Building cross-platform mobile apps with React Native',
    priority: 'high',
    tags: ['mobile', 'react-native', 'apps'],
    notes: [
      {
        id: generateId(),
        content: 'Research React Native vs Flutter for app development',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    resources: [
      {
        id: generateId(),
        title: 'React Native Documentation',
        url: 'https://reactnative.dev',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    transactions: [],
    activityLog: [
      {
        id: generateId(),
        type: 'created',
        description: 'Hustle "Mobile App Development" created',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'E-commerce Store',
    status: 'future',
    description: 'Selling handmade crafts online through Shopify',
    priority: 'medium',
    tags: ['e-commerce', 'shopify', 'crafts'],
    notes: [],
    resources: [
      {
        id: generateId(),
        title: 'Shopify Setup Guide',
        url: 'https://www.shopify.com/blog/how-to-start-online-store',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    transactions: [],
    activityLog: [
      {
        id: generateId(),
        type: 'created',
        description: 'Hustle "E-commerce Store" created',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Seed the database with sample data
 */
export async function seedDatabase(): Promise<void> {
  try {
    // Check if database is already seeded
    const existing = await hustleDB.getAll();
    if (existing.length > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    console.log('Seeding database with sample data...');

    // Add sample hustles with proper IDs and order
    for (let i = 0; i < sampleHustles.length; i++) {
      const hustle: Hustle = {
        ...sampleHustles[i],
        id: generateId(),
        order: i,
      };
      await hustleDB.add(hustle);
    }

    console.log(`✓ Seeded ${sampleHustles.length} sample hustles`);
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
}

/**
 * Clear all data from database (useful for testing)
 */
export async function clearDatabase(): Promise<void> {
  try {
    await hustleDB.clear();
    console.log('✓ Database cleared');
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
}
