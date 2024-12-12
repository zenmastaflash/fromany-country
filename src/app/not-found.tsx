export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-4">Could not find requested resource</p>
      <p>
        <a href="/" className="text-indigo-600 hover:underline">
          Return Home
        </a>
      </p>
    </main>
  );
}