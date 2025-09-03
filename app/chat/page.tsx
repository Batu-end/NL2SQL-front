'use client';

import { AppShell, Tabs, Text } from '@mantine/core';
import { useState } from 'react';
import { SchemaExplorer } from '@/components/SchemaExplorer/SchemaExplorer';
import { DataTableViewer } from '@/components/DataTableViewer/DataTableViewer';

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<string | null>('chat');
  const [viewingTable, setViewingTable] = useState<string | null>(null);

  const handleTableSelect = (tableName: string) => {
    setViewingTable(tableName);
    setActiveTab(tableName); // Switch to the new tab
  };

  return (
    <AppShell navbar={{ width: 300, breakpoint: 'sm' }} padding="md">
      <AppShell.Navbar p="md">
        <SchemaExplorer onTableSelect={handleTableSelect} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="chat">Chat</Tabs.Tab>
            {viewingTable && <Tabs.Tab value={viewingTable}>{viewingTable}</Tabs.Tab>}
          </Tabs.List>

          <Tabs.Panel value="chat" pt="md">
            {/* Your chat components will go here */}
            <Text>This is the main chat interface.</Text>
            <Text>You can ask questions like "Show me all orders from the last 7 days."</Text>
          </Tabs.Panel>

          {viewingTable && (
            <Tabs.Panel value={viewingTable} pt="md">
              <DataTableViewer tableName={viewingTable} />
            </Tabs.Panel>
          )}
        </Tabs>
      </AppShell.Main>
    </AppShell>
  );
}
