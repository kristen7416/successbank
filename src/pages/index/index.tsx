import { View, Text } from "@tarojs/components"
import { useState, useEffect } from "react"
import Taro from "@tarojs/taro"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Network } from "@/network"
import { CirclePlus, Flame, TrendingUp, Star, Sparkles, ChevronRight } from "lucide-react-taro"

export default function IndexPage() {
  const [stats, setStats] = useState({
    totalDeposits: 0,
    coins: 0,
    streak: 0,
    level: 1,
    levelName: "新手储户",
    todayDeposits: 0,
  })
  const [recentDeposits, setRecentDeposits] = useState<any[]>([])
  const [todayTask, setTodayTask] = useState<any>(null)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const [statsRes, depositsRes, taskRes] = await Promise.all([
        Network.request({ url: "/api/deposits/stats" }),
        Network.request({ url: "/api/deposits?limit=5" }),
        Network.request({ url: "/api/tasks/today" }),
      ])

      console.log("Stats response:", statsRes.data)
      console.log("Deposits response:", depositsRes.data)
      console.log("Today task response:", taskRes.data)

      if (statsRes.data?.data) {
        setStats(statsRes.data.data)
      }
      if (depositsRes.data?.data) {
        setRecentDeposits(depositsRes.data.data.list || depositsRes.data.data || [])
      }
      if (taskRes.data?.data) {
        setTodayTask(taskRes.data.data)
      }
    } catch (err) {
      console.log("Fetch home data error:", err)
    }
  }

  const goToDeposit = () => {
    Taro.switchTab({ url: "/pages/deposit/index" })
  }

  const goToTasks = () => {
    Taro.switchTab({ url: "/pages/tasks/index" })
  }

  const goToToolbox = () => {
    Taro.switchTab({ url: "/pages/toolbox/index" })
  }

  const levelProgress = () => {
    const thresholds = [0, 10, 30, 60, 100, 150, 210, 280, 360, 500]
    const current = stats.totalDeposits
    const levelIdx = Math.min(stats.level - 1, thresholds.length - 2)
    const base = thresholds[levelIdx]
    const next = thresholds[levelIdx + 1]
    return next > base ? ((current - base) / (next - base)) * 100 : 100
  }

  return (
    <View className="min-h-full bg-gray-50 pb-20">
      {/* 顶部欢迎区 */}
      <View className="bg-sky-500 px-4 pt-6 pb-8 rounded-b-3xl">
        <View className="flex flex-row items-center justify-between mb-4">
          <View>
            <Text className="block text-sky-100 text-sm">欢迎来到</Text>
            <Text className="block text-white text-xl font-bold">成功银行</Text>
          </View>
          <View className="bg-white bg-opacity-20 rounded-full px-3 py-1">
            <Text className="block text-white text-xs">Lv.{stats.level} {stats.levelName}</Text>
          </View>
        </View>

        {/* 账户余额卡片 */}
        <Card className="bg-white bg-opacity-95 border-0 shadow-lg">
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between">
              <View>
                <Text className="block text-gray-500 text-xs mb-1">成功币余额</Text>
                <View className="flex flex-row items-baseline gap-1">
                  <Text className="block text-sky-600 text-3xl font-bold">{stats.coins}</Text>
                  <Text className="block text-sky-400 text-sm">枚</Text>
                </View>
              </View>
              <View className="bg-amber-100 rounded-full px-4 py-2">
                <Text className="block text-amber-700 text-xs font-semibold">累计 {stats.totalDeposits} 次成功</Text>
              </View>
            </View>

            <Separator className="my-3" />

            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-1">
                <Flame size={16} color="#f59e0b" />
                <Text className="block text-amber-600 text-sm font-semibold">连续 {stats.streak} 天</Text>
              </View>
              <View className="flex flex-row items-center gap-1">
                <TrendingUp size={16} color="#10b981" />
                <Text className="block text-emerald-600 text-sm">今日 +{stats.todayDeposits}</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 等级进度 */}
      <View className="px-4 mt-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between mb-2">
              <Text className="block text-sm font-semibold text-gray-700">等级进度</Text>
              <Text className="block text-xs text-gray-400">Lv.{stats.level} → Lv.{stats.level + 1}</Text>
            </View>
            <Progress value={levelProgress()} className="h-2" />
          </CardContent>
        </Card>
      </View>

      {/* 快捷操作 */}
      <View className="px-4 mt-4">
        <View className="flex flex-row gap-3">
          <View className="flex-1" onClick={goToDeposit}>
            <Card className="border-0 shadow-sm bg-sky-50">
              <CardContent className="p-3 flex flex-col items-center gap-2">
                <CirclePlus size={24} color="#0ea5e9" />
                <Text className="block text-sky-700 text-xs font-semibold">存入成功</Text>
              </CardContent>
            </Card>
          </View>
          <View className="flex-1" onClick={goToTasks}>
            <Card className="border-0 shadow-sm bg-amber-50">
              <CardContent className="p-3 flex flex-col items-center gap-2">
                <Star size={24} color="#f59e0b" />
                <Text className="block text-amber-700 text-xs font-semibold">今日任务</Text>
              </CardContent>
            </Card>
          </View>
          <View className="flex-1" onClick={goToToolbox}>
            <Card className="border-0 shadow-sm bg-emerald-50">
              <CardContent className="p-3 flex flex-col items-center gap-2">
                <Sparkles size={24} color="#10b981" />
                <Text className="block text-emerald-700 text-xs font-semibold">心理工具</Text>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>

      {/* 今日任务 */}
      {todayTask && (
        <View className="px-4 mt-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <View className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">今日配得感任务</CardTitle>
                <Badge variant="secondary">
                  <Text className="block text-xs">Day {todayTask.day || 1}</Text>
                </Badge>
              </View>
            </CardHeader>
            <CardContent className="pt-0">
              <Text className="block text-sm text-gray-600 mb-3">{todayTask.title || "今天，对自己说一句我值得"}</Text>
              <Button size="sm" onClick={goToTasks}>
                <Text className="block text-sm text-white">去完成</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      )}

      {/* 最近成功记录 */}
      <View className="px-4 mt-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <View className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">最近的成功存款</CardTitle>
              <View className="flex flex-row items-center gap-1" onClick={goToDeposit}>
                <Text className="block text-sky-500 text-xs">查看全部</Text>
                <ChevronRight size={14} color="#0ea5e9" />
              </View>
            </View>
          </CardHeader>
          <CardContent className="pt-0">
            {recentDeposits.length === 0 ? (
              <View className="py-6 flex flex-col items-center">
                <Sparkles size={32} color="#cbd5e1" />
                <Text className="block text-gray-400 text-sm mt-2">还没有存款记录</Text>
                <Text className="block text-gray-300 text-xs mt-1">快去存入你的第一次成功吧</Text>
              </View>
            ) : (
              <View className="flex flex-col gap-2">
                {recentDeposits.map((item, idx) => (
                  <View key={idx} className="flex flex-row items-center justify-between py-2">
                    <View className="flex flex-row items-center gap-2 flex-1">
                      <View className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                        <Star size={14} color="#0ea5e9" />
                      </View>
                      <View className="flex-1">
                        <Text className="block text-sm text-gray-700">{item.content}</Text>
                        <Text className="block text-xs text-gray-400">{item.created_at || ""}</Text>
                      </View>
                    </View>
                    <Badge variant="secondary">
                      <Text className="block text-xs">+{item.coins || 1}</Text>
                    </Badge>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* 一句话鼓励 */}
      <View className="px-4 mt-4 mb-4">
        <Card className="border-0 shadow-sm bg-amber-50">
          <CardContent className="p-4">
            <Text className="block text-amber-800 text-sm text-center italic">
              每一次小小的成功，都在告诉你：你值得所有美好。
            </Text>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
