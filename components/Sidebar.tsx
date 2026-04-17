const navItems = [
  "Dashboard",
  "Orchestration",
  "Execution Logs",
  "Credential Management",
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-primary-navy text-white flex flex-col">
      <div className="px-6 py-6 border-b border-secondary-dark">
        <h1 className="font-heading font-bold text-xl tracking-wide">
          SIGMA AUTOMATE
        </h1>
      </div>
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-1">
          {navItems.map((item, idx) => (
            <li key={item}>
              <a
                href="#"
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  idx === 0
                    ? "bg-secondary-dark text-white"
                    : "text-light-gray hover:bg-secondary-dark hover:text-white"
                }`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
