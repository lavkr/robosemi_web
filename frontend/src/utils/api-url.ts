export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
}
