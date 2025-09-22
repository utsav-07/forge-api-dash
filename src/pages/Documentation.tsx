import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Download, ExternalLink } from "lucide-react";

export default function Documentation() {
  const codeExamples = [
    {
      title: "Text Embedding",
      language: "Python",
      code: `import requests

headers = {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
}

data = {
    'text': 'Your text to embed',
    'model': 'text-embedding-ada-002'
}

response = requests.post(
    'https://api.forge.dev/v1/text/embed',
    headers=headers,
    json=data
)

embeddings = response.json()['embeddings']`,
    },
    {
      title: "Document Search",
      language: "JavaScript",
      code: `const response = await fetch('https://api.forge.dev/v1/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'semantic search query',
    limit: 10,
    threshold: 0.8
  })
});

const results = await response.json();
console.log(results.documents);`,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
        <p className="text-muted-foreground">
          Complete guides and API references for integrating Forge API services
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Quick setup guide and authentication
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code className="h-5 w-5 text-primary" />
              API Reference
            </CardTitle>
            <CardDescription>
              Complete endpoint documentation
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5 text-primary" />
              SDKs & Libraries
            </CardTitle>
            <CardDescription>
              Download official client libraries
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Code Examples</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {codeExamples.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                  <Badge variant="secondary">{example.language}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{example.code}</code>
                </pre>
                <Button variant="outline" size="sm" className="mt-3">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Example
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Authentication Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            All API requests require authentication using your API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Authorization Header</h4>
            <pre className="bg-muted p-3 rounded text-sm">
              Authorization: Bearer your_api_key_here
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Rate Limits</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Free tier: 1,000 requests per month</li>
              <li>• Pro tier: 50,000 requests per month</li>
              <li>• Enterprise: Custom limits available</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Error Handling */}
      <Card>
        <CardHeader>
          <CardTitle>Error Handling</CardTitle>
          <CardDescription>
            Standard HTTP response codes and error formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                200
              </Badge>
              <span className="text-sm">Success - Request completed successfully</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                400
              </Badge>
              <span className="text-sm">Bad Request - Invalid parameters</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                401
              </Badge>
              <span className="text-sm">Unauthorized - Invalid API key</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                429
              </Badge>
              <span className="text-sm">Rate Limit Exceeded</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}