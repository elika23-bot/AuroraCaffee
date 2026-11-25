import LoginForm from "./LoginForm";

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/admin") ? next : "/admin";

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink-950 px-6 py-16">
      <LoginForm next={safeNext} />
    </main>
  );
}
