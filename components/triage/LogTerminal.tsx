export type LogLine = {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
  isRootCause?: boolean;
};

type Props = {
  logs: LogLine[];
  visibleCount: number;
  highlightError: boolean;
};

const levelColor = (level: LogLine["level"]): string => {
  switch (level) {
    case "INFO":
      return "text-accent-blue";
    case "WARN":
      return "text-yellow-300";
    case "ERROR":
      return "text-red-400";
  }
};

export default function LogTerminal({ logs, visibleCount, highlightError }: Props) {
  return (
    <div className="w-full h-full rounded-xl border border-white/10 bg-black/70 backdrop-blur shadow-2xl overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 font-heading font-semibold text-[11px] tracking-[0.16em] text-light-gray uppercase">
          ymca-north — server.log
        </span>
        <span className="ml-auto text-[10px] font-mono text-light-gray/50">
          tail -f
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 font-mono text-[12px] leading-relaxed text-light-gray/90 space-y-1">
        {logs.slice(0, visibleCount).map((log) => {
          const isHighlighted = highlightError && log.isRootCause;
          return (
            <div
              key={log.id}
              className={`animate-line-in whitespace-pre rounded px-2 py-0.5 -mx-2 transition-colors duration-300 ${
                isHighlighted
                  ? "bg-red-500/20 ring-1 ring-red-500/50"
                  : ""
              }`}
            >
              <span className="text-light-gray/50">{log.timestamp}</span>{" "}
              <span className={`font-semibold ${levelColor(log.level)}`}>
                {log.level.padEnd(5)}
              </span>{" "}
              <span className="text-light-gray/60">{log.service.padEnd(10)}</span>{" "}
              <span
                className={
                  isHighlighted ? "text-red-300 font-semibold" : "text-light-gray/90"
                }
              >
                {log.message}
              </span>
            </div>
          );
        })}

        {visibleCount < logs.length && (
          <span className="inline-block w-2 h-4 bg-accent-blue align-middle animate-cursor-blink" />
        )}
      </div>
    </div>
  );
}
