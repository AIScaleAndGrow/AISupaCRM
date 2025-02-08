import React from 'react';
import { logger } from '@/utils/logger';

const OpportunitiesPage = () => {
  logger.info('Opportunities page mounted');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Opportunities</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Sales opportunity management features coming soon...</p>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
