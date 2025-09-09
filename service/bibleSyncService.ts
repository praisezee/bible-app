import axios, { AxiosResponse } from 'axios';
import { ApiResponse, BibleData, UpdateCheckData } from '@/types/bibleTypes';

// Configure axios instance
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://5ps771fx-3500.uks1.devtunnels.ms';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Check if there are recent Bible updates available
 */
export const checkForBibleUpdates = async (): Promise<UpdateCheckData> => {
  try {
    const response: AxiosResponse<ApiResponse<UpdateCheckData>> =
      await apiClient.get('/api/bible/update');

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Update check failed');
    }
  } catch (error) {
    console.error('[BibleSync] Update check failed:', error);
    throw error;
  }
};

/**
 * Fetch the complete Bible data from API
 */
export const fetchBibleData = async (): Promise<BibleData> => {
  try {
    const response: AxiosResponse<ApiResponse<BibleData>> = await apiClient.get(
      '/api/bible/bible'
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Bible fetch failed');
    }
  } catch (error) {
    console.error('[BibleSync] Bible fetch failed:', error);
    throw error;
  }
};

/**
 * Retry wrapper for API calls with exponential backoff
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[BibleSync] Attempt ${attempt}/${maxRetries} failed:`,
        error
      );

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`[BibleSync] Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};
