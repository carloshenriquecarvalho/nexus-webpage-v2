"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function DashboardCharts({ periodTrendData }: { periodTrendData: any[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Visão por período</h2>
            <p className="text-sm text-zinc-400">Agregação baseada no campo de data/mês.</p>
          </div>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={periodTrendData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#2f2f2f" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#111111", borderColor: "#2f2f2f", color: "#fff" }} />
              <Legend wrapperStyle={{ color: "#9ca3af" }} />
              <Bar dataKey="Investimento" name="Investimento" fill="#F24639" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Tendência de CTR e ROAS</h2>
            <p className="text-sm text-zinc-400">Comparação dos últimos períodos detectados.</p>
          </div>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={periodTrendData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#2f2f2f" strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#111111", borderColor: "#2f2f2f", color: "#fff" }} />
              <Legend wrapperStyle={{ color: "#9ca3af" }} />
              <Line type="monotone" dataKey="CTR" name="CTR (%)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ROAS" name="ROAS" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
