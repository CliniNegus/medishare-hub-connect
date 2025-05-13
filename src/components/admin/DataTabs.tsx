
import React from 'react';
import DataTabsComponent from './data-tabs';

// Properly forward the component instead of just exporting it
const DataTabs = (props: React.ComponentProps<typeof DataTabsComponent>) => {
  return <DataTabsComponent {...props} />;
};

export default DataTabs;
