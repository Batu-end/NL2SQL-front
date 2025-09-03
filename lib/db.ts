
// --- Mock Data and API Simulation ---

// This data would come from a GET /databases endpoint
export const MOCK_DATABASES = [
  { value: 'sales_db', label: 'Sales Database' },
  { value: 'hr_db', label: 'Human Resources DB' },
];

// This data would come from a GET /schema/{dbName} endpoint
export const MOCK_SCHEMAS: Record<string, TableSchema[]> = {
  sales_db: [
    {
      name: 'orders',
      columns: [
        { name: 'id', type: 'INT' },
        { name: 'customer_id', type: 'INT' },
        { name: 'product_id', type: 'INT' },
        { name: 'quantity', type: 'INT' },
        { name: 'order_date', type: 'DATE' },
      ],
      foreignKeys: [
        { column: 'customer_id', references: 'customers', on: 'id' },
        { column: 'product_id', references: 'products', on: 'id' },
      ],
    },
    {
      name: 'customers',
      columns: [
        { name: 'id', type: 'INT' },
        { name: 'first_name', type: 'VARCHAR' },
        { name: 'last_name', type: 'VARCHAR' },
        { name: 'signup_date', type: 'DATE' },
      ],
    },
    {
      name: 'products',
      columns: [
        { name: 'id', type: 'INT' },
        { name: 'name', type: 'VARCHAR' },
        { name: 'price', type: 'DECIMAL' },
      ],
    },
  ],
  hr_db: [
    {
      name: 'employees',
      columns: [
        { name: 'id', type: 'INT' },
        { name: 'full_name', type: 'VARCHAR' },
        { name: 'role', type: 'VARCHAR' },
        { name: 'hire_date', type: 'DATE' },
      ],
    },
  ],
};

// This data would come from a GET /data/{dbName}/{tableName}?page=... endpoint
export const MOCK_TABLE_CONTENT: Record<string, Record<string, any>[]> = {
  orders: Array.from({ length: 55 }, (_, i) => ({
    id: i + 1,
    customer_id: (i % 22) + 1,
    product_id: (i % 15) + 1,
    quantity: Math.floor(Math.random() * 5) + 1,
    order_date: new Date(2025, Math.floor(i / 5), (i % 28) + 1).toISOString().split('T')[0],
  })),
  customers: Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    first_name: ['John', 'Jane', 'Peter', 'Susan'][i % 4],
    last_name: `Doe${i}`,
    signup_date: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
  })),
  products: Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Product #${i}`,
    price: (19.99 + i * 2).toFixed(2),
  })),
  employees: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    full_name: `Employee Name ${i}`,
    role: ['Engineer', 'Manager', 'Designer'][i % 3],
    hire_date: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
  })),
};

// --- TypeScript Types ---

export type ForeignKey = { column: string; references: string; on: string };
// The schema for a single table, now with optional foreign key info
export type TableSchema = {
  name: string;
  columns: { name: string; type: string }[];
  foreignKeys?: ForeignKey[];
};

// The actual data rows. We use Record<string, any> because we don't know the columns beforehand.
export type TableRow = Record<string, any>;

// The response from the paginated content API
export type PaginatedDataResponse = {
  rows: TableRow[];
  totalRows: number;
};

// --- API Fetcher Simulation ---

export const fetchSchema = (dbName: string): Promise<TableSchema[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SCHEMAS[dbName] || []);
    }, 500);
  });

export const fetchTableData = (
  tableName: string,
  page: number,
  limit: number,
): Promise<PaginatedDataResponse> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const table = MOCK_TABLE_CONTENT[tableName] || [];
      const totalRows = table.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      resolve({ rows: table.slice(start, end), totalRows });
    }, 800);
  });
