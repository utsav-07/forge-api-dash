import { Activity, Key, /* Code, */ TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type BackendAPIKey = {
  user_id: string;
  usage_count: number;
  name: string;
  expires_at: string;
  active: boolean;
  created_at: string;
  id: string;
};

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { callApi } = useApi();
  const [keys, setKeys] = useState<BackendAPIKey[]>([]);
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    return null;
  }

  const firstName = user.name.split(' ')[0] || user.name.split('@')[0];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await callApi<{ success: boolean; message: string; data: { api_keys: BackendAPIKey[] } }>(
          '/api-keys',
          { requiresAuth: true, method: 'GET' }
        );
        setKeys(response?.data?.api_keys || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [callApi]);

  const totalCalls = useMemo(() => keys.reduce((sum, k) => sum + (k.usage_count || 0), 0), [keys]);
  const activeKeysCount = useMemo(() => keys.filter(k => k.active).length, [keys]);
  const chartData = useMemo(() => keys.map(k => ({ key: k.name || k.id.slice(0, 6), usage: k.usage_count || 0 })), [keys]);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your API platform activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total API Calls"
          value={loading ? '—' : totalCalls.toLocaleString()}
          change=""
          icon={Activity}
          trend="up"
        />
        <StatsCard
          title="Active Keys"
          value={loading ? '—' : String(activeKeysCount)}
          change=""
          icon={Key}
          trend="up"
        />
        {/** Services Used and Success Rate commented as not available */}
        {/** <StatsCard title="Services Used" value="-" change="" icon={Code} trend="neutral" /> */}
        {/** <StatsCard title="Success Rate" value="-" change="" icon={TrendingUp} trend="up" /> */}
      </div>

      {/* Usage by API */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/** Recent Activity commented out per request */}
        {/** <div className="bg-card border border-border rounded-xl p-6"> ... </div> */}

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">API Usage</h3>
          {chartData.length === 0 ? (
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">No usage yet</p>
              </div>
            </div>
          ) : (
            <ChartContainer config={{ usage: { label: 'Calls', color: 'hsl(var(--primary))' } }} className="h-64">
              <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="key" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </div>
    </div>
  );
}