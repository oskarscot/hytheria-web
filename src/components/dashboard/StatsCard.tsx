import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  subtitle?: string
  progress?: number
}

export function StatsCard({ title, value, icon: Icon, subtitle, progress }: StatsCardProps) {
  return (
    <Card className="bg-slate-900/40 border border-white/5 hover:border-yellow-500/30 transition-all duration-300 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-slate-500 font-sans tracking-widest uppercase">
          {title}
        </CardTitle>
        <div className="p-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
          <Icon className="h-4 w-4 text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-serif text-white tracking-wide">{value}</div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 font-serif italic">
            {subtitle}
          </p>
        )}
        {progress !== undefined && (
          <div className="mt-2">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.5)]" 
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">{progress.toFixed(1)}% to next level</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
