import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function ApiExample() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { callApi } = useApi();
  const { toast } = useToast();

  const handleFetchData = async () => {
    setLoading(true);
    try {
      // Example of calling an API endpoint that requires authentication
      const result = await callApi('/some-protected-endpoint', {
        requiresAuth: true,
        method: 'GET'
      });
      setData(result);
      toast({
        title: "Success",
        description: "Data fetched successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateData = async () => {
    setLoading(true);
    try {
      // Example of calling an API endpoint that requires authentication and sends data
      const result = await callApi('/some-protected-endpoint', {
        requiresAuth: true,
        method: 'POST',
        body: JSON.stringify({ name: 'Example', value: 123 })
      });
      setData(result);
      toast({
        title: "Success",
        description: "Data created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">API Hook Example</h2>
      
      <div className="flex gap-4">
        <Button onClick={handleFetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Data'}
        </Button>
        
        <Button onClick={handleCreateData} disabled={loading}>
          {loading ? 'Creating...' : 'Create Data'}
        </Button>
      </div>
      
      {data && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Response Data:</h3>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}