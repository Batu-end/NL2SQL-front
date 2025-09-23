// --- API Configuration ---
const API_BASE_URL = 'http://localhost:8000'; // Your FastAPI backend URL

// --- TypeScript Types ---
// These types should match the Pydantic models in your FastAPI backend.

export type Database = {
  value: string;
  label: string;
};

export type ForeignKey = { column: string; references: string; on: string };

export type TableSchema = {
  name: string;
  columns: { name: string; type: string }[];
  foreignKeys?: ForeignKey[];
};

export type TableRow = Record<string, any>;

export type PaginatedDataResponse = {
  rows: TableRow[];
  totalRows: number;
};

// --- API Fetcher Functions ---

/**
 * Fetches the list of available databases from the backend.
 */
export const fetchDatabases = async (): Promise<Database[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/databases`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch databases:', error);
    // Return an empty array or a mock object in case of error
    return [];
  }
};

/**
 * Fetches the schema for a given database.
 * @param dbName - The name of the database to fetch the schema for.
 */
export const fetchSchema = async (dbName: string): Promise<TableSchema[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schema/${dbName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch schema for ${dbName}:`, error);
    return [];
  }
};

/**
 * Fetches paginated data from a specific table.
 * @param tableName - The name of the table.
 * @param page - The page number to retrieve.
 * @param limit - The number of rows per page.
 */
export const fetchTableData = async (
  tableName: string,
  page: number,
  limit: number
): Promise<PaginatedDataResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/data/${tableName}?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch data for table ${tableName}:`, error);
    // Return a default response that indicates no data
    return { rows: [], totalRows: 0 };
  }
};