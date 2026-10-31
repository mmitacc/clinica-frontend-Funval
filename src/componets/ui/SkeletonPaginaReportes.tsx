export default function SkeletonPaginaReportes() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse"
          >
            <div className="h-5 bg-slate-200 rounded w-1/3"></div>
            <div className="h-[280px] bg-slate-100 rounded-lg flex items-end justify-between p-4 space-x-2">
              <div className="w-full bg-slate-200 rounded-t h-[40%]"></div>
              <div className="w-full bg-slate-200 rounded-t h-[75%]"></div>
              <div className="w-full bg-slate-200 rounded-t h-[20%]"></div>
              <div className="w-full bg-slate-200 rounded-t h-[60%]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
