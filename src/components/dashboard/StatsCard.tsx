import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  subtitle?: string
}

export function StatsCard({ title, value, icon: Icon, subtitle }: StatsCardProps) {
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
        <div className="text-2xl font-bold font-display text-white tracking-wide">{value}</div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 font-serif italic">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
