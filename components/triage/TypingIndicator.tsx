export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-line-in flex-row-reverse">
      <div className="w-8 h-8 rounded-full bg-accent-blue text-white font-heading font-semibold text-xs flex items-center justify-center shrink-0">
        S
      </div>
      <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 bg-white/[0.06] border border-white/10 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-light-gray/70 animate-typing-dot" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-light-gray/70 animate-typing-dot"
          style={{ animationDelay: "140ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-light-gray/70 animate-typing-dot"
          style={{ animationDelay: "280ms" }}
        />
      </div>
    </div>
  );
}
