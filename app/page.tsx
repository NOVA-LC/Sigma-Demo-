import Sidebar from "@/components/Sidebar";
import WorkflowDashboard from "@/components/workflow/WorkflowDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-primary-navy">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <WorkflowDashboard />
      </main>
    </div>
  );
}
