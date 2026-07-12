import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  FileText, 
  Download,
  Filter,
  Wrench, 
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import KPICard from '../../components/ui/KPICard';

const EXPENSES_DATA = [
  { month: 'Jan', Fuel: 45000, Maintenance: 28000, Labor: 65000, Logistics: 32000 },
  { month: 'Feb', Fuel: 48000, Maintenance: 31000, Labor: 68000, Logistics: 30000 },
  { month: 'Mar', Fuel: 51000, Maintenance: 25000, Labor: 70000, Logistics: 34000 },
  { month: 'Apr', Fuel: 46000, Maintenance: 35000, Labor: 66000, Logistics: 38000 },
  { month: 'May', Fuel: 53000, Maintenance: 29000, Labor: 71000, Logistics: 40000 },
  { month: 'Jun', Fuel: 49000, Maintenance: 33000, Labor: 69000, Logistics: 35000 },
];

const RECENT_TRANSACTIONS = [
  { id: 'TRX-8942', date: '2026-07-12', category: 'Fuel', amount: '₹14,500.00', status: 'Completed', vendor: 'Bharat Petroleum' },
  { id: 'TRX-8941', date: '2026-07-11', category: 'Maintenance', amount: '₹32,100.00', status: 'Pending', vendor: 'Caterpillar Service' },
  { id: 'TRX-8940', date: '2026-07-10', category: 'Logistics', amount: '₹8,450.00', status: 'Completed', vendor: 'Western Railways' },
  { id: 'TRX-8939', date: '2026-07-09', category: 'Labor', amount: '₹145,000.00', status: 'Completed', vendor: 'Port Workers Union' },
  { id: 'TRX-8938', date: '2026-07-08', category: 'Fuel', amount: '₹18,200.00', status: 'Completed', vendor: 'Indian Oil' },
];

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-display-lg text-port-navy">Financials & Expenses</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Track operational costs, fuel expenses, and vendor payments.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline flex items-center gap-2 text-sm bg-white border border-outline-variant px-4 py-2 rounded-md hover:bg-surface-container">
            <Filter size={16} /> Filter
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 shadow-sm">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Expenses (YTD)" 
          value="₹1,284,500" 
          icon={<DollarSign size={20} className="text-error" />} 
          trend="+4.2%" trendDirection="up"
        />
        <KPICard 
          title="Fuel Costs (YTD)" 
          value="₹292,000" 
          icon={<DollarSign size={20} className="text-warning" />} 
          trend="-1.5%" trendDirection="down"
        />
        <KPICard 
          title="Maintenance Costs" 
          value="₹181,000" 
          icon={<Wrench size={20} className="text-secondary" />} 
          trend="+12%" trendDirection="up"
        />
        <KPICard 
          title="Pending Invoices" 
          value="14" 
          icon={<FileText size={20} className="text-port-navy" />} 
          subtitle="Awaiting Approval"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-xl shadow-card p-6">
          <h2 className="text-headline-sm font-semibold mb-6">Expense Breakdown by Category</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EXPENSES_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Labor" stackId="a" fill="#1e3a8a" />
                <Bar dataKey="Fuel" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Maintenance" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Logistics" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Budget */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-port-navy to-secondary/90 rounded-xl p-6 text-white shadow-card">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><CreditCard size={20}/> Operating Budget</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">Monthly Allocation</span>
                  <span className="font-bold">₹800,000</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Spent (78%)</span>
                  <span className="font-bold">₹624,000</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              <p className="text-xs text-white/70 italic">On track to remain under budget for July.</p>
            </div>
          </div>
          
          <div className="bg-white border border-outline-variant rounded-xl shadow-card p-6">
             <h3 className="font-semibold text-port-navy mb-4">Quick Actions</h3>
             <div className="space-y-3">
               <button className="w-full py-2 bg-surface hover:bg-surface-container border border-outline-variant rounded-lg text-sm font-medium transition-colors text-left px-4 flex justify-between items-center">
                 Upload Vendor Invoice <FileText size={16} className="text-secondary"/>
               </button>
               <button className="w-full py-2 bg-surface hover:bg-surface-container border border-outline-variant rounded-lg text-sm font-medium transition-colors text-left px-4 flex justify-between items-center">
                 Approve Pending (14) <CheckCircle2 size={16} className="text-success"/>
               </button>
               <button className="w-full py-2 bg-surface hover:bg-surface-container border border-outline-variant rounded-lg text-sm font-medium transition-colors text-left px-4 flex justify-between items-center">
                 Generate Tax Report <Download size={16} className="text-port-navy"/>
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-outline-variant rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-outline-variant">
          <h2 className="text-headline-sm font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-on-surface-variant text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Transaction ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Vendor</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant">
              {RECENT_TRANSACTIONS.map((trx, idx) => (
                <tr key={idx} className="hover:bg-surface-container/50 transition-colors">
                  <td className="p-4 font-mono font-medium text-secondary">{trx.id}</td>
                  <td className="p-4 text-on-surface-variant">{trx.date}</td>
                  <td className="p-4 font-medium text-port-navy">{trx.vendor}</td>
                  <td className="p-4">
                    <span className="bg-surface border border-outline-variant px-2 py-1 rounded text-xs">
                      {trx.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold">{trx.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      trx.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
