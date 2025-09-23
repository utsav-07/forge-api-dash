import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';

export default function GenerateKeyTest() {
  const [keyName, setKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { callApi } = useApi();
  const { toast } = useToast();

  const handleGenerateKey = async () => {
    if (!keyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await callApi<{ api_key: string }>(`/generate-key?name=${encodeURIComponent(keyName)}`, {
        method: 'POST',
        requiresAuth: true,
      });
      
      setGeneratedKey(response.api_key);
      toast({
        title: "Success",
        description: "API key generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Test API Key Generation</h2>
        <p className="text-muted-foreground">
          This is a test component to verify the /generate-key endpoint integration
        </p>
      </div>

      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="testKeyName">Key Name *</Label>
          <Input
            id="testKeyName"
            placeholder="Enter a name for your API key"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleGenerateKey} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Generating..." : "Generate API Key"}
        </Button>

        {generatedKey && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h3 className="font-semibold">Generated API Key:</h3>
            <code className="block p-2 bg-background rounded text-sm font-mono break-all">
              {generatedKey}
            </code>
            <p className="text-sm text-muted-foreground">
              Name: {keyName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}