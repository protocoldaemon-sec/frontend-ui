import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'swap' | 'stake' | 'unstake';
  amount: string;
  token: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  txHash: string;
};

type TimeFilter = '24h' | '7d' | '30d' | 'all';

export function History() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7d');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - replace with actual data fetching
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: '1.25',
      token: 'ETH',
      status: 'completed',
      timestamp: '2025-09-18T14:30:00Z',
      txHash: '0x123...456'
    },
    {
      id: '2',
      type: 'swap',
      amount: '2500',
      token: 'USDC',
      status: 'pending',
      timestamp: '2025-09-17T09:15:00Z',
      txHash: '0x789...012'
    },
    {
      id: '3',
      type: 'stake',
      amount: '500',
      token: 'DAI',
      status: 'completed',
      timestamp: '2025-09-15T16:45:00Z',
      txHash: '0x345...678'
    },
  ];

  const filteredTransactions = transactions.filter(tx => {
    // Apply time filter (mock implementation)
    const now = new Date();
    const txDate = new Date(tx.timestamp);
    const timeDiff = now.getTime() - txDate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (timeFilter === '24h' && hoursDiff > 24) return false;
    if (timeFilter === '7d' && hoursDiff > 168) return false; // 7 days
    if (timeFilter === '30d' && hoursDiff > 720) return false; // 30 days
    
    // Apply type filter
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    
    // Apply status filter
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      failed: 'bg-red-500/20 text-red-400',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeClasses = {
      deposit: 'bg-blue-500/20 text-blue-400',
      withdrawal: 'bg-purple-500/20 text-purple-400',
      swap: 'bg-cyan-500/20 text-cyan-400',
      stake: 'bg-amber-500/20 text-amber-400',
      unstake: 'bg-emerald-500/20 text-emerald-400',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClasses[type as keyof typeof typeClasses] || ''}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="plus-jakarta text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Transaction History</h1>
        
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 p-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Time Range</label>
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="swap">Swap</option>
                    <option value="stake">Stake</option>
                    <option value="unstake">Unstake</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <span>Showing</span>
            <span className="font-medium text-white">{filteredTransactions.length}</span>
            <span>of</span>
            <span className="font-medium text-white">{transactions.length}</span>
            <span>transactions</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Transaction
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-900/30 divide-y divide-slate-800">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(tx.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{tx.amount} {tx.token}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a 
                      href={`https://etherscan.io/tx/${tx.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center justify-end space-x-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <div className="text-slate-500">No transactions found matching your filters.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
