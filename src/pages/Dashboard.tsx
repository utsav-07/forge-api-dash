import { Activity, Key, Code, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface DashboardProps {
  userName: string;
}

export default function Dashboard({ userName }: DashboardProps) {
  const firstName = userName.split(' ')[0] || userName.split('@')[0];

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
          value="24,521"
          change="+12% from last month"
          icon={Activity}
          trend="up"
        />
        <StatsCard
          title="Active Keys"
          value="8"
          change="2 created this week"
          icon={Key}
          trend="up"
        />
        <StatsCard
          title="Services Used"
          value="3"
          change="All services active"
          icon={Code}
          trend="neutral"
        />
        <StatsCard
          title="Success Rate"
          value="99.2%"
          change="+0.3% improvement"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: "Text Embedding API called", time: "2 minutes ago", status: "success" },
              { action: "New API key generated", time: "1 hour ago", status: "info" },
              { action: "Document uploaded for embedding", time: "3 hours ago", status: "success" },
              { action: "Search API query executed", time: "5 hours ago", status: "success" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'success' ? 'bg-success' : 'bg-primary'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Usage Chart Placeholder */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">API Usage This Month</h3>
          <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Usage analytics chart would appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}