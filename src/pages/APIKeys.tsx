import { useState } from "react";
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
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdDate: string;
  lastUsed: string;
  status: "active" | "inactive";
  usage: string;
}

export default function APIKeys() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Production App",
      key: "fa_live_4xK9mN2pQ7sR8tU6vW1xY3zA5bC7dE9f",
      createdDate: "Dec 15, 2024",
      lastUsed: "2 hours ago",
      status: "active",
      usage: "15,240 calls",
    },
    {
      id: "2", 
      name: "Development Testing",
      key: "fa_test_1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1u",
      createdDate: "Dec 10, 2024",
      lastUsed: "1 day ago",
      status: "active",
      usage: "892 calls",
    },
    {
      id: "3",
      name: "Staging Environment",
      key: "fa_dev_9zY8xW7vU6tS5rQ4pO3nM2lK1jI0hG9f",
      createdDate: "Dec 8, 2024",
      lastUsed: "3 days ago",
      status: "active",
      usage: "2,156 calls",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateRandomKey = () => {
    const prefix = "fa_live_";
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = prefix;
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive",
      });
      return;
    }

    const newKey: APIKey = {
      id: (apiKeys.length + 1).toString(),
      name: newKeyName,
      key: generateRandomKey(),
      createdDate: new Date().toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      }),
      lastUsed: "Never",
      status: "active",
      usage: "0 calls",
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "API Key Created",
      description: `New API key "${newKeyName}" has been generated`,
    });
  };

  const handleDeleteKey = (id: string) => {
    const keyName = apiKeys.find(key => key.id === id)?.name;
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      title: "API Key Deleted",
      description: `"${keyName}" has been permanently deleted`,
      variant: "destructive",
    });
  };

  const handleRegenerateKey = (id: string) => {
    const keyName = apiKeys.find(key => key.id === id)?.name;
    setApiKeys(apiKeys.map(key => 
      key.id === id 
        ? { ...key, key: generateRandomKey(), lastUsed: "Never" }
        : key
    ));
    toast({
      title: "API Key Regenerated",
      description: `New key generated for "${keyName}"`,
    });
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
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production App, Development Testing"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateKey()}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateKey} className="flex-1">
                  Generate Key
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            {filteredKeys.map((apiKey) => (
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

      {filteredKeys.length === 0 && (
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