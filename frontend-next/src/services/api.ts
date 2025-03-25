import axios from 'axios';

// API base URL - update this to your deployed backend URL or use environment variable
const API_URL = 'http://127.0.0.1:8000';

/**
 * Register a new user
 * @param userData User registration data
 * @returns User data from the API
 */
export const registerUser = async (userData: { email: string; username: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login a user
 * @param username Username
 * @param password Password
 * @returns Token data from the API
 */
export const loginUser = async (username: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await axios.post(`${API_URL}/api/auth/login`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Send resume for analysis
 * @param formData Form data containing job details and resume file
 * @returns Analysis result from the API
 */
export const analyzeResume = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data) {
      return response.data.data; // Return the nested data object from the response
    } else {
      throw new Error('No data received from the server');
    }
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    } else if (error.response?.status === 413) {
      throw new Error('File size too large. Please upload a smaller file.');
    } else if (error.response?.status === 415) {
      throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An error occurred while analyzing the resume. Please try again.');
    }
  }
};

/**
 * Stream resume analysis with real-time updates
 * @param formData Form data containing job details and resume file
 * @param onUpdate Callback function to handle streaming updates
 * @returns Promise that resolves when streaming is complete
 */
export const streamAnalyzeResume = async (
  formData: FormData,
  onUpdate: (data: any, isComplete: boolean) => void
) => {
  try {
    // Set up streaming with fetch API instead of axios for better streaming support
    const response = await fetch(`${API_URL}/analyze/stream`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the reader from the response body stream
    const reader = response.body!.getReader();
    let partialData: any = {};
    
    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        // Stream is complete, call onUpdate with isComplete=true
        onUpdate(partialData, true);
        break;
      }
      
      // Decode the chunk and parse as JSON
      const chunk = new TextDecoder().decode(value);
      try {
        // Each chunk should be a JSON object with partial data
        const chunkData = JSON.parse(chunk);
        
        // Merge the chunk data with the partial data
        partialData = { ...partialData, ...chunkData };
        
        // Call the onUpdate callback with the partial data
        onUpdate(partialData, false);
      } catch (e) {
        console.error('Error parsing chunk:', e);
      }
    }
    
    return partialData;
  } catch (error: any) {
    console.error('Error streaming resume analysis:', error);
    if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An error occurred while analyzing the resume. Please try again.');
    }
  }
};