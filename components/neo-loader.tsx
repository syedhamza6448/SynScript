'use client'

interface NeoLoaderProps {
  message?: string
}

export function NeoLoader({ message = 'Loading…' }: NeoLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 min-h-[200px]">
      <div
        className="relative w-20 h-20 border-[4px] border-neo-black bg-card shadow-neo-md flex items-center justify-center"
        aria-hidden
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-6 border-2 border-neo-black bg-neo-cyan animate-neo-load-bar"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
      <p className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
        {message}
      </p>
    </div>
  )
}
