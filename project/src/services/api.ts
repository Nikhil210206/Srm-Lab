import axios, { AxiosInstance } from 'axios';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://zigejxdiyaybvcdeadbr.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2VqeGRpeWF5YnZjZGVhZGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NjIwMDksImV4cCI6MjA1NDQzODAwOX0.R4CkcbMP4erdVu2sqSKQpZYWlf2X9eo1WXPD7RHajWU';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Existing API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Define a custom Axios type with additional methods
type CustomAxiosInstance = AxiosInstance & {
  createTest: (testData: any) => Promise<any>;
  updateTest: (testId: string, testData: any) => Promise<any>;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

// Add custom methods using the native axios methods (post and put)
apiClient.createTest = (testData: any) => apiClient.post('/tests', testData);
apiClient.updateTest = (testId: string, testData: any) => apiClient.put(`/tests/${testId}`, testData);

export const api = apiClient;
