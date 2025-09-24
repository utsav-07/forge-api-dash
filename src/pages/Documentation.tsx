import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Code, Download, ExternalLink } from "lucide-react";

const CodeBlock = ({ code }: { code: string }) => (
  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

export default function Documentation() {

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

        {/* Text Embedding (/upload/text) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text Embedding</CardTitle>
            <CardDescription>POST http://18.212.82.121:8000/upload/text</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="python" className="w-full">
              <TabsList>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="python">
                <CodeBlock code={`import requests

url = 'http://18.212.82.121:8000/upload/text'
headers = {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
}
payload = {
    'content': 'Your text to embed',
    'metadata': {}
}
resp = requests.post(url, headers=headers, json=payload)
print(resp.status_code, resp.json())`} />
              </TabsContent>
              <TabsContent value="js">
                <CodeBlock code={`await fetch('http://18.212.82.121:8000/upload/text', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content: 'Your text to embed', metadata: {} })
});`} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Document Search (/query) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Search</CardTitle>
            <CardDescription>POST http://18.212.82.121:8000/query</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="python" className="w-full">
              <TabsList>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="python">
                <CodeBlock code={`import requests

url = 'http://18.212.82.121:8000/query'
headers = {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
}
payload = {
    'query': 'about divyansh sinha tech stack',
    'max_results': 5
}
resp = requests.post(url, headers=headers, json=payload)
print(resp.status_code, resp.json())`} />
              </TabsContent>
              <TabsContent value="js">
                <CodeBlock code={`await fetch('http://18.212.82.121:8000/query', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: 'about divyansh sinha tech stack', max_results: 5 })
});`} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* File Upload (/upload/file) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload File</CardTitle>
            <CardDescription>POST http://18.212.82.121:8000/upload/file</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="python" className="w-full">
              <TabsList>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="python">
                <CodeBlock code={`import requests

url = 'http://18.212.82.121:8000/upload/file'
headers = { 'X-API-Key': 'your_api_key' }
files = { 'file': open('your_file.pdf', 'rb') }
resp = requests.post(url, headers=headers, files=files)
print(resp.status_code, resp.json())`} />
              </TabsContent>
              <TabsContent value="js">
                <CodeBlock code={`const form = new FormData();
form.append('file', yourFile); // from <input type="file" />

await fetch('http://18.212.82.121:8000/upload/file', {
  method: 'POST',
  headers: { 'X-API-Key': 'your_api_key' },
  body: form
});`} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
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
            <div className="space-y-2">
              <pre className="bg-muted p-3 rounded text-sm">X-API-Key: your_api_key_here</pre>
              <div className="text-xs text-muted-foreground">Use X-API-Key for authenticated endpoints in this demo.</div>
            </div>
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