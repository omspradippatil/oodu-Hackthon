import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AreaChartWidget from '../../components/charts/AreaChartWidget';
import BarChartWidget from '../../components/charts/BarChartWidget';
import PieChartWidget from '../../components/charts/PieChartWidget';
import LineChartWidget from '../../components/charts/LineChartWidget';

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-charts'],
    queryFn: () => analyticsApi.getCharts(),
  });

  const charts = (data as any)?.data ?? {};

  const fleetUtil = charts.fleetUtilization ?? [
    { name:'Mon', utilization:72 }, { name:'Tue', utilization:85 }, { name:'Wed', utilization:78 },
    { name:'Thu', utilization:91 }, { name:'Fri', utilization:88 }, { name:'Sat', utilization:65 }, { name:'Sun', utilization:55 },
  ];
  const fuelData = charts.fuelConsumption ?? [
    { name:'Mon', litres:1200 }, { name:'Tue', litres:1450 }, { name:'Wed', litres:1380 },
    { name:'Thu', litres:1620 }, { name:'Fri', litres:1550 }, { name:'Sat', litres:980 }, { name:'Sun', litres:750 },
  ];
  const tripsData = charts.tripsPerDay ?? [
    { name:'Mon', trips:24 }, { name:'Tue', trips:31 }, { name:'Wed', trips:28 },
    { name:'Thu', trips:35 }, { name:'Fri', trips:32 }, { name:'Sat', trips:18 }, { name:'Sun', trips:12 },
  ];
  const costData = charts.operationalCost ?? [
    { name:'Jan', cost:285000 }, { name:'Feb', cost:310000 }, { name:'Mar', cost:298000 },
    { name:'Apr', cost:325000 }, { name:'May', cost:340000 }, { name:'Jun', cost:315000 },
  ];
  const statusDist = charts.vehicleStatus ?? [
    { name:'Available', value:18, color:'#27AE60' },
    { name:'On Trip', value:12, color:'#2D5BFF' },
    { name:'In Shop', value:4, color:'#F5A623' },
    { name:'Retired', value:2, color:'#E74C3C' },
  ];
  const containerThroughput = charts.containerThroughput ?? [
    { name:'Jan', received:120, dispatched:110 }, { name:'Feb', received:145, dispatched:138 },
    { name:'Mar', received:132, dispatched:125 }, { name:'Apr', received:160, dispatched:155 },
    { name:'May', received:178, dispatched:170 }, { name:'Jun', received:165, dispatched:162 },
  ];

  if (isLoading) return <LoadingSpinner/>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-lg text-on-surface">Analytics</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">Operational intelligence and performance trends</p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-headline-sm font-semibold mb-4">Fleet Utilization (%)</h2>
          <AreaChartWidget
            data={fleetUtil}
            xKey="name"
            areas={[{ key:'utilization', color:'#2D5BFF', label:'Utilization %' }]}
            height={220}
          />
        </div>
        <div className="card p-5">
          <h2 className="text-headline-sm font-semibold mb-4">Fuel Consumption (Litres/Day)</h2>
          <BarChartWidget
            data={fuelData}
            xKey="name"
            bars={[{ key:'litres', color:'#F5A623', label:'Litres' }]}
            height={220}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5">
          <h2 className="text-headline-sm font-semibold mb-4">Vehicle Status Distribution</h2>
          <PieChartWidget data={statusDist} height={220}/>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-headline-sm font-semibold mb-4">Trips Per Day</h2>
          <LineChartWidget
            data={tripsData}
            xKey="name"
            lines={[{ key:'trips', color:'#27AE60', label:'Trips' }]}
            height={220}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-headline-sm font-semibold mb-4">Container Throughput (TEU/Month)</h2>
          <BarChartWidget
            data={containerThroughput}
            xKey="name"
            bars={[
              { key:'received', color:'#2D5BFF', label:'Received' },
              { key:'dispatched', color:'#27AE60', label:'Dispatched' },
            ]}
            height={220}
          />
        </div>
        <div className="card p-5">
          <h2 className="text-headline-sm font-semibold mb-4">Operational Cost Trend (₹/Month)</h2>
          <AreaChartWidget
            data={costData}
            xKey="name"
            areas={[{ key:'cost', color:'#E74C3C', label:'Cost ₹' }]}
            height={220}
          />
        </div>
      </div>

      {/* Summary Table */}
      <div className="card p-5">
        <h2 className="text-headline-sm font-semibold mb-4">Monthly Performance Summary</h2>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Month</th>
                <th>Containers Received</th>
                <th>Containers Dispatched</th>
                <th>Operational Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {containerThroughput.map((row:any, i:number)=>(
                <tr key={i}>
                  <td className="text-data font-medium">{row.name}</td>
                  <td className="text-data">{row.received}</td>
                  <td className="text-data">{row.dispatched}</td>
                  <td className="text-data">₹{(costData[i]?.cost||0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
