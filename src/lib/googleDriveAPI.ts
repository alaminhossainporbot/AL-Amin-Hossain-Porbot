// Browser-compatible Google Drive API service
const API_KEY = 'AIzaSyBnuWAs3yC_DwgmqOO8_ZXaPb7MjvoyH2Q';
const BASE_URL = 'https://www.googleapis.com/drive/v3';
const SHEETS_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  featured: boolean;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export class GoogleDriveAPIService {
  private async makeRequest(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async listFiles(folderId?: string): Promise<DriveFile[]> {
    try {
      const query = folderId ? `'${folderId}' in parents` : '';
      const params = new URLSearchParams({
        key: API_KEY,
        fields: 'files(id, name, mimeType, modifiedTime)',
        ...(query && { q: query }),
      });

      const response = await fetch(`${BASE_URL}/files?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string): Promise<Blob> {
    try {
      const params = new URLSearchParams({
        key: API_KEY,
        alt: 'media',
      });

      const response = await fetch(`${BASE_URL}/files/${fileId}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async getSheetData(spreadsheetId: string, range: string): Promise<any[][]> {
    try {
      const params = new URLSearchParams({
        key: API_KEY,
      });

      const response = await fetch(`${SHEETS_URL}/${spreadsheetId}/values/${range}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error getting sheet data:', error);
      throw error;
    }
  }

  async updateSheetData(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    try {
      const response = await fetch(`${SHEETS_URL}/${spreadsheetId}/values/${range}?valueInputOption=RAW&key=${API_KEY}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating sheet data:', error);
      throw error;
    }
  }
}

export const googleDriveAPI = new GoogleDriveAPIService();