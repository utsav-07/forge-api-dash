import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';

export default function ApiKeyGenerator() {
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
      // Call the backend API to generate a new key with name as query parameter
      const response = await callApi<{ api_key: string }>(`/generate-key?name=${encodeURIComponent(keyName)}`, {
        method: 'POST',
        requiresAuth: true,
      });
      
      setGeneratedKey(response.api_key);
      toast({
        title: "API Key Generated",
        description: `New API key "${keyName}" has been created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedKey) return;
    
    try {
      await navigator.clipboard.writeText(generatedKey);
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy API key to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className=\"container mx-auto py-8\">
      <div className=\"max-w-2xl mx-auto space-y-6\">
        <div className=\"text-center space-y-2\">
          <h1 className=\"text-3xl font-bold\">API Key Generator</h1>
          <p className=\"text-muted-foreground\">
            Generate new API keys for your applications
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate New API Key</CardTitle>
            <CardDescription>
              Create a new API key for your application. The key name is for your reference only.
            </CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"space-y-2\">
              <Label htmlFor=\"keyName\">Key Name *</Label>
              <Input
                id=\"keyName\"
                placeholder=\"e.g., Production App, Development Testing\"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button 
              onClick={handleGenerateKey} 
              disabled={isLoading}
              className=\"w-full\"
            >
              {isLoading ? \"Generating API Key...\" : \"Generate New API Key\"}
            </Button>
          </CardContent>
        </Card>

        {generatedKey && (
          <Card>
            <CardHeader>
              <CardTitle>Generated API Key</CardTitle>
              <CardDescription>
                Your new API key is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className=\"space-y-4\">
              <div className=\"space-y-2\">
                <Label>Key Name</Label>
                <div className=\"p-3 bg-muted rounded-md font-medium\">
                  {keyName}
                </div>
              </div>
              
              <div className=\"space-y-2\">
                <Label>API Key</Label>
                <div className=\"flex gap-2\">
                  <Input
                    readOnly
                    value={generatedKey}
                    className=\"font-mono\"
                  />
                  <Button 
                    onClick={copyToClipboard}
                    variant=\"outline\"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className=\"p-4 bg-yellow-50 border border-yellow-200 rounded-lg\">
                <h3 className=\"font-semibold text-yellow-800\">Important</h3>
                <p className=\"text-sm text-yellow-700\">
                  Store this key securely. You won't be able to see it again once you navigate away from this page.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>API Key Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4 text-sm\">
              <div>
                <h3 className=\"font-medium mb-1\">Authentication Header</h3>
                <code className=\"block p-3 bg-muted rounded font-mono text-xs\">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
              
              <div>
                <h3 className=\"font-medium mb-1\">Example Request</h3>
                <pre className=\"p-3 bg-muted rounded text-xs overflow-x-auto\">
{`curl -X POST https://api.example.com/v1/query \\
  -H \"Authorization: Bearer \${generatedKey || 'YOUR_API_KEY'}\" \\
  -H \"Content-Type: application/json\" \\
  -d '{\"query\": \"Your search query\"}'`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}