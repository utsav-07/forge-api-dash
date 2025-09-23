import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface APIServiceCardProps {
  title: string;
  description: string;
  features: string;
  status: "active" | "inactive" | "maintenance";
  endpoint?: string;
  buttonText: string;
  buttonAction: () => void;
  usageCount?: string;
  supportedFormats?: string[];
  className?: string;
  docsAction?: () => void;
}

export function APIServiceCard({
  title,
  description,
  features,
  status,
  endpoint,
  buttonText,
  buttonAction,
  usageCount,
  supportedFormats,
  className,
  docsAction,
}: APIServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const copyEndpoint = async () => {
    if (endpoint) {
      await navigator.clipboard.writeText(endpoint);
      toast({
        title: "Copied!",
        description: "API endpoint copied to clipboard",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "inactive":
        return "bg-muted text-muted-foreground border-border";
      case "maintenance":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card 
      className={cn(
        "api-card group relative overflow-hidden",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs font-medium", getStatusColor(status))}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              {usageCount && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {usageCount} calls
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Features</h4>
            <p className="text-xs text-muted-foreground">{features}</p>
          </div>

          {supportedFormats && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Supported Formats</h4>
              <div className="flex flex-wrap gap-1">
                {supportedFormats.map((format) => (
                  <Badge key={format} variant="secondary" className="text-xs">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {endpoint && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">API Endpoint</h4>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <code className="text-xs font-mono flex-1 truncate">{endpoint}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="copy-button h-6 w-6 p-0"
                  onClick={copyEndpoint}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1" 
            onClick={buttonAction}
            disabled={status === "maintenance"}
          >
            {buttonText}
          </Button>
          <Button variant="outline" size="sm" className="px-3" onClick={docsAction}>
            <FileText className="h-4 w-4 mr-1" />
            Docs
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>

      {/* Hover effect gradient */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 pointer-events-none",
          isHovered && "opacity-100"
        )}
      />
    </Card>
  );
}