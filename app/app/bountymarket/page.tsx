
import React from 'react';
import { Database, Shield } from 'lucide-react';
import { Header } from '@/components/header';

const BountyMarket = () => {
  return (
    <>
    <Header />
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Bounty Marketplace</h1>
      </div>
      <p className="text-gray-600 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        This is the bounty marketplace for Daemon Protocol.
      </p>
    </div>
    </>
  );
};

export default BountyMarket;
