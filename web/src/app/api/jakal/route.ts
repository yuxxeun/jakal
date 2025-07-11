export async function GET() {
  const res = await fetch("http://localhost:8080/api/jakal", {
    next: { revalidate: 0 },
  });
  const data = await res.json();
  return Response.json(data);
}
