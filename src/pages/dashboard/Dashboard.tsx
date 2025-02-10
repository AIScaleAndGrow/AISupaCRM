import { Card } from "@/components/ui/card";

export function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to AISupaCRM</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Recent Leads</h2>
          <p className="text-gray-600">No leads yet</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Active Opportunities</h2>
          <p className="text-gray-600">No opportunities yet</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          <p className="text-gray-600">No tasks yet</p>
        </Card>
      </div>
    </div>
  );
}
