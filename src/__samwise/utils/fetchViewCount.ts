// utils/fetchViewCount.ts

import { CounterAPI } from 'counterapi';
import { DEFAULT_COUNTER_ID } from '@/config'; // Import DEFAULT_COUNTER_ID

const counter = new CounterAPI(); // Initialize CounterAPI

// Utility function to sanitize the id
const sanitizeId = (id: string): string => {
  return id
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
};

// Function to get the view count
export const getViewCount = async (id: string): Promise<number> => {
  const sanitizedId = sanitizeId(id);
  return 0;

  try {
    const res = await counter.get(DEFAULT_COUNTER_ID, sanitizedId);
    return res.Count;
  } catch (error) {
    // Narrow the error type
    if (error) {
      console.log(
        `View count for "${sanitizedId}" does not exist. Initializing the view count.`,
      );
      console.log(
        `View count for "${sanitizedId}" does not exist. Initializing the view count.`,
      );
      // Increment the view count for the first time
      return await incrementViewCount(id);
    }

    console.error('Error fetching view count with counter.get:', error);

    return 0; // Return 0 if fetching fails for any other reason
  }
};

// Function to increment the view count
export const incrementViewCount = async (id: string): Promise<number> => {
  const sanitizedId = sanitizeId(id);

  try {
    const res = await counter.up(DEFAULT_COUNTER_ID, sanitizedId);
    return res.Count;
  } catch (error) {
    console.error('Error incrementing view count with counter.up:', error);
    return 0; // Return 0 if incrementing fails
  }
};
