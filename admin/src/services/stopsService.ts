import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/stops';

export interface Stop {
  id: string;
  stop_name: string;
  stop_code: string;
  latitude: number;
  longitude: number;
  zone: string;
  is_active: boolean;
  created_at?: string;
}

export interface StopResponse {
  success: boolean;
  data?: Stop | Stop[];
  error?: string;
  message?: string;
}

/**
 * Fetch all stops from the database
 */
export const getAllStops = async (): Promise<StopResponse> => {
  try {
    const response = await axios.get<StopResponse>(API_BASE_URL);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch stops'
    };
  }
};

/**
 * Create a new stop
 */
export const createStop = async (stopData: Omit<Stop, 'id' | 'created_at'>): Promise<StopResponse> => {
  try {
    const response = await axios.post<StopResponse>(API_BASE_URL, stopData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create stop'
    };
  }
};

/**
 * Update an existing stop
 */
export const updateStop = async (id: string, stopData: Partial<Stop>): Promise<StopResponse> => {
  try {
    const response = await axios.put<StopResponse>(`${API_BASE_URL}/${id}`, stopData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update stop'
    };
  }
};

/**
 * Delete a stop
 */
export const deleteStop = async (id: string): Promise<StopResponse> => {
  try {
    const response = await axios.delete<StopResponse>(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to delete stop'
    };
  }
};
