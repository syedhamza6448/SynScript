'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { FolderOpen, Plus, FileText, Users } from 'lucide-react'

const COLORS = ['#00BCD4', '#FFEB3B', '#FF4081', '#4CAF50', '#FF9800']

interface VaultData {
  id: string
  name: string
  description: string | null
  created_at: string
  owner_id: string
  role: string
}

interface DashboardContentProps {
  vaults: VaultData[]
  sourcesCount: { vault_id: string; count: number }[]
  membersCount: { vault_id: string; count: number }[]
  isOwner: boolean
}

export function DashboardContent({
  vaults,
  sourcesCount,
  membersCount,
  isOwner,
}: DashboardContentProps) {
  const sourcesByVault = vaults
    .filter((v) => v.role === 'owner')
    .map((v) => ({
      name: v.name.length > 12 ? v.name.slice(0, 12) + '...' : v.name,
      sources: sourcesCount.find((s) => s.vault_id === v.id)?.count ?? 0,
      members: membersCount.find((m) => m.vault_id === v.id)?.count ?? 0,
    }))

  const pieData = sourcesByVault.map((v, i) => ({
    name: v.name,
    value: v.sources,
    color: COLORS[i % COLORS.length],
  })).filter((d) => d.value > 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="border-[4px] border-neo-black bg-neo-cyan p-4">
            <FolderOpen className="h-8 w-8 text-[#121212] stroke-[2.25]" />
          </div>
          <div>
            <p className="text-2xl font-black">{vaults.length}</p>
            <p className="text-sm font-medium text-muted-foreground">Total Vaults</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/vaults">
            <Plus className="h-4 w-4 mr-2 stroke-[2.25]" />
            Go to Vaults
          </Link>
        </Button>
      </div>

      {isOwner && sourcesByVault.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[4px] border-neo-black shadow-neo-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 stroke-[2.25]" />
                Sources per Vault
              </CardTitle>
              <CardDescription>Number of sources in your owned vaults</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourcesByVault} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-50" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        border: '3px solid black',
                        fontWeight: 600,
                      }}
                    />
                    <Bar dataKey="sources" fill="#00BCD4" stroke="black" strokeWidth={2} radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[4px] border-neo-black shadow-neo-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 stroke-[2.25]" />
                Members per Vault
              </CardTitle>
              <CardDescription>Collaborators in your owned vaults</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourcesByVault} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-50" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        border: '3px solid black',
                        fontWeight: 600,
                      }}
                    />
                    <Bar dataKey="members" fill="#FF4081" stroke="black" strokeWidth={2} radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {pieData.length > 0 && (
            <Card className="md:col-span-2 border-[4px] border-neo-black shadow-neo-md">
              <CardHeader>
                <CardTitle>Sources Distribution</CardTitle>
                <CardDescription>Share of sources across your vaults</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="black"
                        strokeWidth={2}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          border: '3px solid black',
                          fontWeight: 600,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card className="border-[4px] border-neo-black shadow-neo-md">
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Your vaults at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          {vaults.length === 0 ? (
            <p className="text-muted-foreground font-medium py-4">
              No vaults yet. Create your first vault to get started.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaults.slice(0, 6).map((v) => (
                <Link key={v.id} href={`/vaults/${v.id}`}>
                  <div className="border-[3px] border-neo-black bg-card p-4 hover:bg-secondary/50 hover:-translate-y-0.5 hover:shadow-neo-md transition-all">
                    <p className="font-bold truncate">{v.name}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold uppercase ${
                        v.role === 'owner'
                          ? 'bg-neo-yellow'
                          : v.role === 'contributor'
                          ? 'bg-neo-cyan/80'
                          : 'bg-neo-gray'
                      }`}
                    >
                      {v.role}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/vaults">View All Vaults</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
