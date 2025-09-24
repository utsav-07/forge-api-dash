import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/useApi";

type Mode = "search" | "text" | "file";

interface APITestDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: Mode;
}

export function APITestDialog({ open, onOpenChange, mode }: APITestDialogProps) {
  const { callApi, getAuthHeaders } = useApi();
  const [apiKey, setApiKey] = useState<string>("");
  const [query, setQuery] = useState<string>("about divyansh sinha tech stack");
  const [maxResults, setMaxResults] = useState<number>(5);
  const [textContent, setTextContent] = useState<string>("Hello from API tester");
  const [file, setFile] = useState<File | null>(null);
  const [responsePreview, setResponsePreview] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem("forge_api_key") || "";
      setApiKey(saved);
      setResponsePreview("");
      setStatus("");
    }
  }, [open]);

  const title = useMemo(() => {
    switch (mode) {
      case "search":
        return "Test Search (POST /query)";
      case "text":
        return "Test Text Upload (POST /upload/text)";
      case "file":
        return "Test File Upload (POST /upload/file)";
    }
  }, [mode]);

  const send = async () => {
    setLoading(true);
    setResponsePreview("");
    setStatus("");
    try {
      if (!apiKey) throw new Error("API Key required");
      localStorage.setItem("forge_api_key", apiKey);

      if (mode === "search") {
        const res = await callApi<any>(`/query`, {
          method: "POST",
          headers: { ...getAuthHeaders(), "X-API-Key": apiKey },
          body: JSON.stringify({ query, max_results: maxResults }),
        });
        setResponsePreview(JSON.stringify(res, null, 2));
        setStatus("200 OK");
      }

      if (mode === "text") {
        const res = await callApi<any>(`/upload/text`, {
          method: "POST",
          headers: { ...getAuthHeaders(), "X-API-Key": apiKey },
          body: JSON.stringify({ content: textContent, metadata: {} }),
        });
        setResponsePreview(JSON.stringify(res, null, 2));
        setStatus("200 OK");
      }

      if (mode === "file") {
        if (!file) throw new Error("Please choose a file");
        const form = new FormData();
        form.append("file", file);
        const res = await fetch(`http://18.212.82.121:8000/upload/file`, {
          method: "POST",
          headers: { "X-API-Key": apiKey }, // no JSON header for multipart
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || data?.message || res.statusText);
        setResponsePreview(JSON.stringify(data, null, 2));
        setStatus(`${res.status} ${res.statusText}`);
      }
    } catch (e: any) {
      setResponsePreview(String(e?.message || e));
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-w-[95vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key (header: X-API-Key)</label>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your API key" />
          </div>

          {mode === "search" && (
            <div className="grid gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Query</label>
                <Textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Results</label>
                <Input type="number" value={maxResults} onChange={(e) => setMaxResults(parseInt(e.target.value || '0', 10))} />
              </div>
            </div>
          )}

          {mode === "text" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Content</label>
              <Textarea value={textContent} onChange={(e) => setTextContent(e.target.value)} rows={5} />
            </div>
          )}

          {mode === "file" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">File</label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={send} disabled={loading}>{loading ? "Sending..." : "Execute"}</Button>
            <Button variant="outline" onClick={() => { setResponsePreview(""); setStatus(""); }}>Clear</Button>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Status: {status || "—"}</div>
            <pre className="p-3 bg-muted rounded-md text-xs overflow-auto max-h-64 whitespace-pre-wrap break-words">
{responsePreview || "Response will appear here"}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


