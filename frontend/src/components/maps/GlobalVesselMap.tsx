import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Ship, Anchor, Navigation } from 'lucide-react';

// Custom icons using Lucide SVGs wrapped in div icons for Leaflet
const createShipIcon = (color: string) => L.divIcon({
  html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/></svg></div>`,
  className: 'custom-ship-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const portIcon = L.divIcon({
  html: `<div style="background-color: #0B1F33; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 15px rgba(45, 91, 255, 0.6);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><line x1="5" y1="12" x2="19" y2="12"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg></div>`,
  className: 'custom-port-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

// Vadhvan Port approximate coordinates
const VADHVAN_PORT: [number, number] = [19.803, 72.637];

// Mock ship data with paths approaching Vadhvan
const SHIPS = [
  {
    id: 'IMO-9780471',
    name: 'Mumbai Maersk',
    type: 'Ultra Large Container',
    speed: 21.5,
    eta: '4 hrs',
    color: '#3B82F6',
    path: [
      [18.5, 71.0], [19.0, 71.5], [19.4, 72.0], VADHVAN_PORT
    ] as [number, number][]
  },
  {
    id: 'IMO-9406738',
    name: 'Nhava Sheva Express',
    type: 'Containers',
    speed: 18.2,
    eta: '6.5 hrs',
    color: '#8B5CF6',
    path: [
      [17.0, 72.0], [18.0, 72.2], [19.0, 72.4], VADHVAN_PORT
    ] as [number, number][]
  },
  {
    id: 'IMO-9231248',
    name: 'MSC India',
    type: 'Containers/General',
    speed: 16.8,
    eta: '12 hrs',
    color: '#10B981',
    path: [
      [21.5, 70.0], [20.8, 71.2], [20.2, 72.0], VADHVAN_PORT
    ] as [number, number][]
  }
];

export default function GlobalVesselMap() {
  const [activeShip, setActiveShip] = useState<string | null>(null);
  
  // Animation state to move ships along their paths
  const [progress, setProgress] = useState(0.7); // 70% along the path initially

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p + 0.001) % 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getInterpolatedPosition = (path: [number, number][], p: number): [number, number] => {
    if (p >= 1) return path[path.length - 1];
    if (p <= 0) return path[0];
    
    const segments = path.length - 1;
    const scaledP = p * segments;
    const index = Math.floor(scaledP);
    const remainder = scaledP - index;
    
    const start = path[index];
    const end = path[index + 1];
    
    return [
      start[0] + (end[0] - start[0]) * remainder,
      start[1] + (end[1] - start[1]) * remainder
    ];
  };

  return (
    <div className="h-full w-full relative bg-surface rounded-md border border-outline-variant overflow-hidden z-0">
      <MapContainer 
        center={[19.5, 71.8]} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Dark theme styled map tiles (using CartoDB Dark Matter) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Port Marker */}
        <Marker position={VADHVAN_PORT} icon={portIcon}>
          <Popup className="custom-popup">
            <div className="p-1">
              <h3 className="font-bold text-sm text-port-navy flex items-center gap-1">
                <Anchor size={14} /> Vadhvan Mega Port
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">Status: Fully Operational</p>
            </div>
          </Popup>
        </Marker>

        {/* Ships and Paths */}
        {SHIPS.map((ship) => {
          const currentPos = getInterpolatedPosition(ship.path, progress);
          return (
            <React.Fragment key={ship.id}>
              <Polyline 
                positions={ship.path} 
                color={ship.color} 
                weight={2} 
                opacity={0.3} 
                dashArray="5, 10" 
              />
              <Marker 
                position={currentPos} 
                icon={createShipIcon(ship.color)}
                eventHandlers={{
                  click: () => setActiveShip(ship.id)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ship.color }} />
                      <h3 className="font-bold text-sm text-port-navy">{ship.name}</h3>
                    </div>
                    <div className="space-y-1 text-xs text-on-surface-variant">
                      <p><strong>IMO:</strong> {ship.id}</p>
                      <p><strong>Type:</strong> {ship.type}</p>
                      <p><strong>Speed:</strong> {ship.speed} kn</p>
                      <p><strong>ETA:</strong> {ship.eta}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-card border border-outline-variant">
        <h4 className="font-semibold text-sm flex items-center gap-2 text-port-navy mb-2">
          <Navigation size={16} className="text-secondary" /> 
          Live Vessel Tracking
        </h4>
        <div className="space-y-2">
          {SHIPS.map(ship => (
            <div 
              key={ship.id} 
              className="flex items-center justify-between gap-4 text-xs cursor-pointer hover:bg-background p-1.5 rounded"
              onClick={() => setActiveShip(ship.id)}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ship.color }} />
                <span className="font-medium">{ship.name}</span>
              </div>
              <span className="text-on-surface-variant font-mono">{ship.eta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
