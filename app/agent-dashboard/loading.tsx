export default function AgentDashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rutaal-green border-t-transparent" />
        <p className="text-sm text-[#323030]/60">Loading agent dashboard…</p>
      </div>
    </div>
  );
}
