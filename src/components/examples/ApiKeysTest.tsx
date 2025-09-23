import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';

interface BackendAPIKey {
  user_id: string;
  usage_count: number;
  name: string;
  expires_at: string;
  active: boolean;
  created_at: string;
  id: string;
}

export default function ApiKeysTest() {
  const [apiKeys, setApiKeys] = useState<BackendAPIKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { callApi } = useApi();

  const loadAPIKeys = async () => {
    setIsLoading(true);
    try {
      const response = await callApi<{ api_keys: BackendAPIKey[] }>('/api-keys', {
        requiresAuth: true,
        method: 'GET'
      });
      
      setApiKeys(response.api_keys);
      toast({
        title: "Success",
        description: `Loaded ${response.api_keys.length} API keys`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAPIKeys();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Keys Test</h2>
        <Button onClick={loadAPIKeys} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      
      {apiKeys.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Your API Keys:</h3>
          <ul className="space-y-2">
            {apiKeys.map((key) => (
              <li key={key.id} className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{key.name}</div>
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(key.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Usage: {key.usage_count} calls
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: {key.active ? "Active" : "Inactive"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-muted-foreground">No API keys found</p>
      )}
    </div>
  );
}