# useApi Hook Documentation

The `useApi` hook is a custom React hook that provides a convenient way to make API calls throughout your application. It automatically handles authentication headers and error handling.

## Usage

```typescript
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { callApi, getAuthHeaders } = useApi();
  
  const fetchData = async () => {
    try {
      const data = await callApi('/api/endpoint', {
        requiresAuth: true, // Set to true if the endpoint requires authentication
        method: 'GET'
      });
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  
  return (
    <button onClick={fetchData}>Fetch Data</button>
  );
}
```

## API

### `callApi<T>(url: string, options?: ApiOptions): Promise<T>`

Makes an API call to the specified URL.

#### Parameters

- `url`: The URL to call (relative to your API base)
- `options`: Request options (extends RequestInit)
  - `requiresAuth`: Boolean indicating if the request requires authentication
  - All other RequestInit options (method, headers, body, etc.)

#### Returns

A promise that resolves to the JSON response data.

#### Example

```typescript
// GET request with authentication
const userData = await callApi('/users/123', {
  requiresAuth: true,
  method: 'GET'
});

// POST request with data
const newRecord = await callApi('/records', {
  requiresAuth: true,
  method: 'POST',
  body: JSON.stringify({ name: 'Test', value: 42 })
});
```

### `getAuthHeaders(): HeadersInit`

Returns the authentication headers that would be used for API calls.

#### Returns

An object containing the authorization header if the user is authenticated.

#### Example

```typescript
const headers = getAuthHeaders();
// Returns: { 'Authorization': 'Bearer <token>' } or { 'Content-Type': 'application/json' }
```

## Error Handling

The hook automatically handles API errors and throws JavaScript Error objects with descriptive messages:

```typescript
try {
  const data = await callApi('/api/endpoint', { requiresAuth: true });
} catch (error) {
  // error is an instance of Error with a descriptive message
  console.error(error.message);
}
```

## Authentication

The hook automatically includes the user's authentication token in requests when:
1. `requiresAuth` is set to `true` in the options
2. The user is currently authenticated (has a valid token)

If `requiresAuth` is true but the user is not authenticated, the hook will throw an error.