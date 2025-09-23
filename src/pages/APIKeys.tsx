import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { APIKeyRow } from "@/components/dashboard/APIKeyRow";
import { Plus, Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdDate: string;
  lastUsed: string;
  status: "active" | "inactive";
  usage: string;
}

interface BackendAPIKey {
  user_id: string;
  usage_count: number;
  name: string;
  expires_at: string;
  active: boolean;
  created_at: string;
  id: string;
}

export default function APIKeys() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { callApi } = useApi();

  const filteredKeys = apiKeys?.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load API keys on component mount
  useEffect(() => {
    loadAPIKeys();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const loadAPIKeys = async () => {
    setIsRefreshing(true);
    try {
      // Call the backend API to get the list of API keys
      const response = await callApi<{ api_keys: BackendAPIKey[] }>('/api-keys', {
        requiresAuth: true,
        method: 'GET'
      });
      console.log("Fetched API keys:", response?.data);
      
      // Transform backend API keys to our frontend format
      const transformedKeys: APIKey[] = response?.data?.api_keys?.map(key => ({
        id: key.id,
        name: key.name,
        // key: `fa_${key.id.substring(0, 8)}...${key.id.substring(key.id.length - 4)}`,
        key: key.id,
        createdDate: formatDate(key.created_at),
        lastUsed: key.usage_count > 0 ? `${key.usage_count} uses` : "Never",
        status: key.active ? "active" : "inactive",
        usage: `${key.usage_count} calls`,
      }));
      
      setApiKeys(transformedKeys);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load API keys",
        variant: "destructive",
      });
      console.log("Error loading API keys:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
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
      const response = await callApi<{ api_key: string }>(`/generate-key?name=${encodeURIComponent(newKeyName)}`, {
        method: 'POST',
        requiresAuth: true,
      });

      // After creating a new key, refresh the list
      await loadAPIKeys();
      
      setNewKeyName("");
      setIsCreateDialogOpen(false);
      
      toast({
        title: "API Key Created",
        description: `New API key "${newKeyName}" has been generated`,
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

  const handleDeleteKey = async (id: string) => {
    try {
      // Call the backend API to delete the key
      await callApi(`/api-keys/${id}`, {
        method: 'DELETE',
        requiresAuth: true,
      });
      
      // Refresh the list after deletion
      await loadAPIKeys();
      
      toast({
        title: "API Key Deleted",
        description: "API key has been permanently deleted",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateKey = async (id: string) => {
    try {
      // Find the key name before regenerating
      const keyName = apiKeys.find(key => key.id === id)?.name || "API Key";
      
      // Call the backend API to regenerate the key
      await callApi(`/api-keys/${id}/regenerate`, {
        method: 'POST',
        requiresAuth: true,
      });
      
      // Refresh the list after regeneration
      await loadAPIKeys();
      
      toast({
        title: "API Key Regenerated",
        description: `New key generated for "${keyName}"`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys and monitor their usage
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadAPIKeys}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New API Key</DialogTitle>
                <DialogDescription>
                  Create a new API key for your application. Give it a descriptive name 
                  to help you identify its purpose.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name *</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production App, Development Testing"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateKey()}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCreateKey} 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Generating..." : "Generate Key"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search API keys..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* API Keys Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeys?.map((apiKey) => (
              <APIKeyRow
                key={apiKey.id}
                apiKey={apiKey}
                onDelete={handleDeleteKey}
                onRegenerate={handleRegenerateKey}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredKeys?.length === 0 && !isRefreshing && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "No API keys match your search" : "No API keys found"}
          </p>
        </div>
      )}

      {/* Usage Guidelines */}
      <div className="bg-muted/50 border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">API Key Security</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Keep your API keys secure and never share them publicly</p>
          <p>• Use different keys for different environments (production, staging, development)</p>
          <p>• Regenerate keys regularly and when team members leave</p>
          <p>• Monitor usage patterns to detect unusual activity</p>
        </div>
      </div>
    </div>
  );
}