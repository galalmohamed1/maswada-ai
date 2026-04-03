export default function MaswadaLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-6">
        {/* AI Core Animation */}
        <div className="relative flex items-center justify-center">
          {/* Outer Glow */}
          <div className="absolute w-32 h-32 rounded-full bg-green-500/20 blur-2xl animate-pulse"></div>

          {/* Ring */}
          <div className="w-20 h-20 border-4 border-green-500/30 rounded-full"></div>

          {/* Rotating Ring */}
          <div className="absolute w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

          {/* Center Dot */}
          <div className="absolute w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-white text-lg font-semibold tracking-wide">
            Maswada AI
          </p>
          <p className="text-zinc-300 text-sm animate-pulse">
            Generating smart content...
          </p>
        </div>
      </div>
    </div>
  );
}
