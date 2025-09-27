"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Hammer, Scissors } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface HisobotlarStatsProps {
  refreshTrigger?: number
}

interface Stats {
  tovarlar: number
  zakazlar: number
  mebel: number
  kronka: number
}

export function HisobotlarStats({ refreshTrigger }: HisobotlarStatsProps) {
  const [stats, setStats] = useState<Stats>({
    tovarlar: 0,
    zakazlar: 0,
    mebel: 0,
    kronka: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      setLoading(true)

      try {
        // Get counts from each table
        const [tovarlarResult, zakazlarResult, mebelResult, kronkaResult] = await Promise.all([
          supabase.from("tovarlar").select("*", { count: "exact", head: true }),
          supabase.from("zakazlar").select("*", { count: "exact", head: true }),
          supabase.from("mebel").select("*", { count: "exact", head: true }),
          supabase.from("kronka").select("*", { count: "exact", head: true }),
        ])

        setStats({
          tovarlar: tovarlarResult.count || 0,
          zakazlar: zakazlarResult.count || 0,
          mebel: mebelResult.count || 0,
          kronka: kronkaResult.count || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [refreshTrigger])

  const statCards = [
    {
      title: "Tovarlar",
      value: stats.tovarlar,
      icon: Package,
      description: "Jami tovarlar soni",
    },
    {
      title: "Zakazlar",
      value: stats.zakazlar,
      icon: ShoppingCart,
      description: "Jami zakazlar soni",
    },
    {
      title: "Mebel",
      value: stats.mebel,
      icon: Hammer,
      description: "Mebel ishlab chiqarish",
    },
    {
      title: "Kronka",
      value: stats.kronka,
      icon: Scissors,
      description: "Lenta ishlab chiqarish",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted/20 rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted/20 rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted/20 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="glass-card animate-slideIn">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
