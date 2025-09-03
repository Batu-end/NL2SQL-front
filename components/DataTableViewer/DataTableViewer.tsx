import { useEffect, useState } from 'react';
import { Loader, Pagination, Table, Title } from '@mantine/core';
import { fetchTableData, TableRow } from '@/lib/db';
import classes from './DataTableViewer.module.css';

interface DataTableViewerProps {
  tableName: string;
}

export function DataTableViewer({ tableName }: DataTableViewerProps) {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  const [activePage, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!tableName) {
      setTableData([]);
      return;
    }
    setLoadingData(true);
    fetchTableData(tableName, activePage, rowsPerPage).then((res) => {
      setTableData(res.rows);
      setTotalRows(res.totalRows);
      if (res.rows.length > 0) {
        setTableHeaders(Object.keys(res.rows[0]));
      } else {
        setTableHeaders([]);
      }
      setLoadingData(false);
    });
  }, [tableName, activePage]);

  useEffect(() => {
    setPage(1);
  }, [tableName]);

  const totalPages = Math.ceil(totalRows / rowsPerPage);

  if (loadingData) {
    return <Loader />;
  }

  return (
    <div className={classes.wrapper}>
      <Title order={5} mb="sm">
        Contents of: {tableName}
      </Title>
      <div className={classes.tableWrapper}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {tableHeaders.map((header) => (
                <Table.Th key={header}>{header}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tableData.map((row, rowIndex) => (
              <Table.Tr key={rowIndex}>
                {tableHeaders.map((header) => (
                  <Table.Td key={`${rowIndex}-${header}`}>{String(row[header])}</Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      {totalPages > 1 && (
        <Pagination
          className={classes.pagination}
          total={totalPages}
          value={activePage}
          onChange={setPage}
        />
      )}
    </div>
  );
}
