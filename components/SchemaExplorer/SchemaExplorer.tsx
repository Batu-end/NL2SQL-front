
import { Accordion, Group, Loader, Pill, Select, Text, Title, Tooltip } from '@mantine/core';
import { IconKey } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { fetchDatabases, fetchSchema, TableSchema, Database } from '@/lib/db';

interface SchemaExplorerProps {
  onTableSelect: (tableName: string) => void;
}

export function SchemaExplorer({ onTableSelect }: SchemaExplorerProps) {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [selectedTableInAccordion, setSelectedTableInAccordion] = useState<string | null>(null);

  useEffect(() => {
    fetchDatabases().then((dbs) => {
      setDatabases(dbs);
      if (dbs.length > 0) {
        setSelectedDb(dbs[0].value);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedDb) {
      setSchema([]);
      return;
    }
    setLoadingSchema(true);
    fetchSchema(selectedDb).then((s) => {
      setSchema(s);
      setLoadingSchema(false);
    });
  }, [selectedDb]);

  const handleAccordionChange = (tableName: string | null) => {
    setSelectedTableInAccordion(tableName);
    if (tableName) {
      onTableSelect(tableName);
    }
  };

  return (
    <>
      <Title order={4} mb="sm">
        Database Explorer
      </Title>
      <Select
        label="Select Database"
        data={databases}
        value={selectedDb}
        onChange={setSelectedDb}
        mb="md"
        disabled={databases.length === 0}
        placeholder={databases.length === 0 ? 'No databases found' : 'Select a database'}
      />
      <Text size="sm" fw={500} mb="xs">
        Tables
      </Text>
      {loadingSchema ? (
        <Loader />
      ) : (
        <Accordion value={selectedTableInAccordion} onChange={handleAccordionChange}>
          {schema.map((table) => {
            const foreignKeys = table.foreignKeys || [];
            return (
              <Accordion.Item key={table.name} value={table.name}>
                <Accordion.Control>{table.name}</Accordion.Control>
                <Accordion.Panel>
                  {table.columns.map((col) => {
                    const fk = foreignKeys.find((f) => f.column === col.name);
                    if (fk) {
                      return (
                        <Tooltip
                          key={col.name}
                          label={`Links to ${fk.references}(${fk.on})`}
                          withArrow
                        >
                          <Pill size="xs" mr={4} mb={4}>
                            <Group gap="xs">
                              <IconKey size={12} />
                              {col.name} ({col.type})
                            </Group>
                          </Pill>
                        </Tooltip>
                      );
                    }
                    return (
                      <Pill key={col.name} size="xs" mr={4} mb={4}>
                        {col.name} ({col.type})
                      </Pill>
                    );
                  })}
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}
    </>
  );
}
