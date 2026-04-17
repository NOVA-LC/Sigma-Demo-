type Author = "Jessica" | "Sigma AI";

type Props = {
  author: Author;
  time: string;
  children: React.ReactNode;
};

export default function ChatMessage({ author, time, children }: Props) {
  const isBot = author === "Sigma AI";
  const initial = isBot ? "S" : "J";

  return (
    <div
      className={`flex gap-3 animate-line-in ${isBot ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-semibold text-xs shrink-0 ${
          isBot
            ? "bg-accent-blue text-white"
            : "bg-light-gray/20 text-light-gray"
        }`}
      >
        {initial}
      </div>

      <div className={`max-w-[78%] ${isBot ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`flex items-center gap-2 mb-1 text-[11px] ${
            isBot ? "flex-row-reverse" : ""
          }`}
        >
          <span className="font-heading font-semibold text-light-gray">
            {author}
          </span>
          <span className="text-light-gray/50">{time}</span>
        </div>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isBot
              ? "bg-accent-blue text-white rounded-tr-sm"
              : "bg-white/[0.06] border border-white/10 text-light-gray rounded-tl-sm"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
