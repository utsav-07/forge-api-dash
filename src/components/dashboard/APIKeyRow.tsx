import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Copy, Eye, EyeOff, MoreHorizontal, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdDate: string;
  lastUsed: string;
  status: "active" | "inactive";
  usage: string;
}

interface APIKeyRowProps {
  apiKey: APIKey;
  onDelete: (id: string) => void;
  onSetActive: (id: string, active: boolean) => void;
}

export function APIKeyRow({ apiKey, onDelete, onSetActive }: APIKeyRowProps) {
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-success/10 text-success border-success/20"
      : "bg-muted text-muted-foreground border-border";
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{apiKey.name}</TableCell>
      <TableCell className="font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {showKey ? apiKey.key : maskKey(apiKey.key)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 copy-button"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 copy-button"
              onClick={() => copyToClipboard(apiKey.key)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {apiKey.createdDate}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {apiKey.lastUsed}
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={cn("text-xs", getStatusColor(apiKey.status))}
        >
          {apiKey.status.charAt(0).toUpperCase() + apiKey.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {apiKey.usage}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {apiKey.status === "active" ? (
              <DropdownMenuItem onClick={() => onSetActive(apiKey.id, false)}>
                <ToggleLeft className="h-4 w-4 mr-2" />
                Deactivate Key
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onSetActive(apiKey.id, true)}>
                <ToggleRight className="h-4 w-4 mr-2" />
                Activate Key
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(apiKey.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}