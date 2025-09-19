
import React from 'react';
import { Database, Shield } from 'lucide-react';
import { Header } from '@/components/header';

const DataMarket = () => {
  return (
    <>
    <Header />
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Data Marketplace</h1>
      </div>
      <p className="text-gray-600 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        This is the data marketplace for the Daemon protocol.
      </p>
    </div>
    </>
  );
};

export default DataMarket;
