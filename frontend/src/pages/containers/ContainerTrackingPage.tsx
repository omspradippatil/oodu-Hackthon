import React, { useState } from 'react';
import { Search, Package, Ship, Truck, Box, Train, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_TRACKING_DATA = {
  containerId: 'VDV-89472-X',
  type: '40ft High Cube Reefer',
  weight: '24,500 kg',
  content: 'Pharmaceuticals (Temp Sensitive)',
  origin: 'Rotterdam, NL',
  destination: 'Pune, IN',
  currentStatus: 'In Transit to Rail Depot',
  temperature: '-18.5°C',
  timeline: [
    {
      id: 1,
      title: 'Discharged from Vessel',
      description: 'Unloaded from MV Mumbai Maersk at Mega Container Terminal-1 by STS Crane 4.',
      time: 'Today, 08:45 AM',
      status: 'completed',
      icon: <Ship size={20} />
    },
    {
      id: 2,
      title: 'Yard Storage (Reefer Stack)',
      description: 'Placed in Block B, Row 12, Tier 3. Connected to power grid.',
      time: 'Today, 09:15 AM',
      status: 'completed',
      icon: <Box size={20} />
    },
    {
      id: 3,
      title: 'Loaded onto Internal Truck',
      description: 'Transferred by RTG Crane to Fleet Vehicle MH-04-TR-9982 (Driver: Rajesh M.)',
      time: 'Today, 11:30 AM',
      status: 'completed',
      icon: <Truck size={20} />
    },
    {
      id: 4,
      title: 'In Transit to Rail Depot',
      description: 'Moving through port internal road network. Expected arrival in 15 mins.',
      time: 'Today, 11:45 AM',
      status: 'current',
      icon: <MapPin size={20} />
    },
    {
      id: 5,
      title: 'Rail Loading',
      description: 'Scheduled for loading onto Freight Train IND-78 (Vadhvan to Pune route).',
      time: 'Pending',
      status: 'pending',
      icon: <Train size={20} />
    }
  ]
};

export default function ContainerTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<typeof MOCK_TRACKING_DATA | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setResult(null);
    
    // Simulate network delay
    setTimeout(() => {
      setResult(MOCK_TRACKING_DATA);
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-display-lg text-port-navy flex justify-center items-center gap-3">
          <Package size={36} className="text-secondary" /> End-to-End Container Tracking
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Enter a Container ID, Bill of Lading, or Booking Number to track full lifecycle.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-on-surface-variant" size={24} />
          <input 
            type="text" 
            placeholder="e.g., VDV-89472-X"
            className="w-full pl-12 pr-32 py-4 rounded-full border-2 border-outline-variant focus:border-secondary focus:ring-4 focus:ring-secondary/20 outline-none transition-all text-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute right-2 px-6 py-2 bg-secondary text-white rounded-full font-bold hover:bg-secondary/90 transition-colors disabled:opacity-70"
          >
            {isSearching ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card border border-outline-variant overflow-hidden mt-8"
          >
            {/* Top Details Panel */}
            <div className="bg-gradient-to-r from-port-navy to-[#1a365d] p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-secondary font-bold tracking-wider text-sm mb-1 uppercase">Container Found</div>
                  <h2 className="text-3xl font-black">{result.containerId}</h2>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-sm">
                    <div className="text-white/60 mb-1">Type</div>
                    <div className="font-semibold">{result.type}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-sm">
                    <div className="text-white/60 mb-1">Live Temp</div>
                    <div className="font-semibold text-blue-300 flex items-center gap-1">
                      {result.temperature}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sub Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant border-b border-outline-variant bg-surface">
              <div className="p-4">
                <div className="text-xs text-on-surface-variant mb-1 uppercase tracking-wider">Weight</div>
                <div className="font-medium text-port-navy">{result.weight}</div>
              </div>
              <div className="p-4">
                <div className="text-xs text-on-surface-variant mb-1 uppercase tracking-wider">Content</div>
                <div className="font-medium text-port-navy truncate">{result.content}</div>
              </div>
              <div className="p-4">
                <div className="text-xs text-on-surface-variant mb-1 uppercase tracking-wider">Origin</div>
                <div className="font-medium text-port-navy">{result.origin}</div>
              </div>
              <div className="p-4">
                <div className="text-xs text-on-surface-variant mb-1 uppercase tracking-wider">Destination</div>
                <div className="font-medium text-port-navy">{result.destination}</div>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="p-8">
              <h3 className="text-headline-sm font-semibold mb-8 text-port-navy">Live Journey</h3>
              
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
                
                {result.timeline.map((step, index) => (
                  <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2
                      ${step.status === 'completed' ? 'bg-success text-white' : 
                        step.status === 'current' ? 'bg-secondary text-white animate-pulse' : 
                        'bg-surface-container text-on-surface-variant'}
                    `}>
                      {step.icon}
                    </div>
                    
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-outline-variant shadow-sm bg-white group-hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-port-navy flex items-center gap-2">
                          {step.title}
                          {step.status === 'completed' && <CheckCircle2 size={16} className="text-success" />}
                          {step.status === 'current' && <Clock size={16} className="text-secondary" />}
                        </div>
                        <time className={`text-xs font-semibold ${step.status === 'pending' ? 'text-on-surface-variant' : 'text-secondary'}`}>
                          {step.time}
                        </time>
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
