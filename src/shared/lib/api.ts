export async function fetchGraphPayload(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch graph: ${res.statusText}`);
  return res.json();
}
