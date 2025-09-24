import { APIServiceCard } from "@/components/dashboard/APIServiceCard";
import { APITestDialog } from "@/components/dashboard/APITestDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function APIServices() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"search" | "text" | "file">("search");

  const handleTryNow = (service: string) => {
    toast({
      title: `${service} Demo`,
      description: "This would open the API testing interface",
    });
  };

  const services = [
    {
      title: "Text Embedding Service",
      description: "Convert your text into high-dimensional vector embeddings for semantic search and similarity analysis. Powered by state-of-the-art transformer models.",
      features: "Real-time processing • Multiple model options • Batch support",
      status: "active" as const,
      endpoint: "http://18.212.82.121:8000/upload/text",
      buttonText: "Try Now",
      usageCount: "15.2K",
      buttonAction: () => { setMode("text"); setDialogOpen(true); },
      docsAction: () => navigate('/dashboard/docs'),
    },
    {
      title: "Document Embedding Service",
      description: "Embed documents (PDF, TXT, Excel) into searchable vector representations. Extract text content and convert to embeddings automatically.",
      features: "Multi-format support • Bulk processing • OCR integration",
      status: "active" as const,
      endpoint: "http://18.212.82.121:8000/upload/file",
      buttonText: "Upload & Embed",
      usageCount: "8.7K",
      supportedFormats: ["PDF", "TXT", "XLSX", "DOCX"],
      buttonAction: () => { setMode("file"); setDialogOpen(true); },
      docsAction: () => navigate('/dashboard/docs'),
    },
    {
      title: "Semantic Document Search",
      description: "Search through your embedded documents using natural language queries. Find relevant content based on meaning, not just keywords.",
      features: "Vector similarity search • Relevance scoring • Fast retrieval",
      status: "active" as const,
      endpoint: "http://18.212.82.121:8000/query",
      buttonText: "Search Demo",
      usageCount: "22.1K",
      buttonAction: () => { setMode("search"); setDialogOpen(true); },
      docsAction: () => navigate('/dashboard/docs'),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">API Services</h1>
        <p className="text-muted-foreground">
          Explore and integrate our powerful API services into your applications
        </p>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">3</div>
          <p className="text-sm text-muted-foreground">Active Services</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-success">99.9%</div>
          <p className="text-sm text-muted-foreground">Uptime</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">46K</div>
          <p className="text-sm text-muted-foreground">Total API Calls</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <APIServiceCard
            key={index}
            {...service}
            className="animate-fade-in"
          />
        ))}
      </div>

      {/* Integration Help */}
      <div className="bg-muted/50 border border-border rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold mb-2">Need Help Integrating?</h3>
        <p className="text-muted-foreground mb-4">
          Our comprehensive documentation includes code examples, SDKs, and step-by-step guides 
          to help you get started quickly with any of our API services.
        </p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard/docs')} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors">
            View Documentation
          </button>
          {/** Download SDKs button commented as requested */}
          {/**
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            Download SDKs
          </button>
          */}
        </div>
      </div>

      <APITestDialog open={dialogOpen} onOpenChange={setDialogOpen} mode={mode} />
    </div>
  );
}