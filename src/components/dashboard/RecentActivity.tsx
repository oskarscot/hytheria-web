import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export function RecentActivity() {
  return (
    <Card className="col-span-1 md:col-span-2 bg-slate-900/40 border border-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-display font-bold text-yellow-500 uppercase tracking-widest">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-500 text-sm">Nothing.</p>
      </CardContent>
    </Card>
  )
}
