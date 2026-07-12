import { useEffect } from 'react';
import toast from 'react-hot-toast';

const ALERT_MESSAGES = [
  { text: 'CRITICAL: Reefer Container Temperature dropping in Mega Terminal 1!', type: 'error', icon: '❄️' },
  { text: 'WARNING: Crane #4 STS motor vibration threshold exceeded. Maintenance required.', type: 'error', icon: '⚠️' },
  { text: 'SUCCESS: AI-Allocated Truck MH-04-1234 passed Gate 2.', type: 'success', icon: '✅' },
  { text: 'INFO: High tide incoming. Pilot operations adjusted.', type: 'blank', icon: '🌊' },
  { text: 'SUCCESS: MV Mumbai Maersk has successfully docked at Terminal 1.', type: 'success', icon: '🚢' },
  { text: 'WARNING: Rail Yard block C reaching 92% capacity.', type: 'error', icon: '🚂' },
  { text: 'INFO: Smart Grid switched to renewable power for Warehouse B.', type: 'success', icon: '⚡' },
];

export function useIoTSimulator(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Simulate random IoT alerts firing every 15-45 seconds
    const scheduleNextAlert = () => {
      const delay = Math.random() * 30000 + 15000; // 15s to 45s
      
      return setTimeout(() => {
        const randomAlert = ALERT_MESSAGES[Math.floor(Math.random() * ALERT_MESSAGES.length)];
        
        if (randomAlert.type === 'error') {
          toast.error(randomAlert.text, { icon: randomAlert.icon, duration: 6000 });
        } else if (randomAlert.type === 'success') {
          toast.success(randomAlert.text, { icon: randomAlert.icon, duration: 4000 });
        } else {
          toast(randomAlert.text, { icon: randomAlert.icon, duration: 4000 });
        }

        scheduleNextAlert();
      }, delay);
    };

    const timer = scheduleNextAlert();
    return () => clearTimeout(timer);
  }, [enabled]);
}
