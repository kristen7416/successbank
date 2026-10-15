import { View, Text } from "@tarojs/components"
import { useState, useEffect } from "react"
import Taro from "@tarojs/taro"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network } from "@/network"
import { Star, Sparkles, Heart, Flame, Coins, Plus, ArrowRight, Sun, Coffee, Hand, Check, Zap, TreePine } from "lucide-react-taro"

const QUICK_DEPOSITS = [
  { label: "按时起床", icon: Sun, color: "bg-yellow-100 border-2 border-yellow-300", iconColor: "#ca8a04", textColor: "text-yellow-700" },
  { label: "完成任务", icon: Check, color: "bg-emerald-100 border-2 border-emerald-300", iconColor: "#059669", textColor: "text-emerald-700" },
  { label: "照顾好自己", icon: Coffee, color: "bg-orange-100 border-2 border-orange-300", iconColor: "#ea580c", textColor: "text-orange-700" },
  { label: "主动打招呼", icon: Hand, color: "bg-teal-100 border-2 border-teal-300", iconColor: "#14b8a6", textColor: "text-teal-700" },
]

interface DepositItem {
  id: string
  content: string
  emotion: string
  coins: number
  difficulty: string
  created_at: string
}

export default function IndexPage() {
  const [totalCoins, setTotalCoins] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [streak, setStreak] = useState(0)
  const [recentDeposits, setRecentDeposits] = useState<DepositItem[]>([])
  const [todayTask, setTodayTask] = useState<{ day: number; title: string } | null>(null)
  const [todayCompleted, setTodayCompleted] = useState(false)
  const [quickDepositSuccess, setQuickDepositSuccess] = useState("")

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const [statsRes, depositsRes, taskRes] = await Promise.all([
        Network.request({ url: "/api/deposits/stats" }),
        Network.request({ url: "/api/deposits", data: { limit: 5 } }),
        Network.request({ url: "/api/tasks/today" }),
      ])
      console.log("Home stats:", statsRes.data)
      console.log("Home deposits:", depositsRes.data)
      console.log("Home task:", taskRes.data)

      if (statsRes.data?.data) {
        const stats = statsRes.data.data
        setTotalCoins(stats.total_coins || 0)
        setTotalDeposits(stats.total_deposits || 0)
        setStreak(stats.streak || 0)
      }

      if (depositsRes.data?.data) {
        const raw = depositsRes.data.data
        const list = Array.isArray(raw) ? raw : (raw.list || [])
        setRecentDeposits(list)
      }

      if (taskRes.data?.data) {
        const taskData = taskRes.data.data
        setTodayTask({ day: taskData.day || 1, title: taskData.title || "今日任务" })
        setTodayCompleted(taskData.completed || false)
      }
    } catch (err) {
      console.log("Fetch home data error:", err)
    }
  }

  const handleQuickDeposit = async (label: string) => {
    try {
      const res = await Network.request({
        url: "/api/deposits",
        method: "POST",
        data: {
          content: label,
          emotion: "开心",
          difficulty: "easy",
          coins: 1,
          type: "preset",
        },
      })
      console.log("Quick deposit response:", res.data)
      setQuickDepositSuccess(label)
      setTimeout(() => setQuickDepositSuccess(""), 1500)
      fetchHomeData()
    } catch (err) {
      console.log("Quick deposit error:", err)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return "夜深了"
    if (hour < 12) return "早上好"
    if (hour < 14) return "中午好"
    if (hour < 18) return "下午好"
    return "晚上好"
  }

  return (
    <View className="min-h-full bg-amber-50 pb-20">
      {/* 顶部欢迎区 - 游戏面板 */}
      <View className="bg-gradient-to-b from-teal-400 to-teal-500 px-4 pt-4 pb-8 rounded-b-[2rem]">
        <Text className="block text-white text-lg font-black mb-1">{getGreeting()}，勇敢的你</Text>
        <Text className="block text-teal-100 text-xs font-bold">每一次微小成功，都值得被郑重记录</Text>
      </View>

      <View className="px-4 -mt-4">
        {/* 成功账户余额面板 */}
        <Card className="border-2 border-yellow-300 bg-gradient-to-b from-white to-amber-50 shadow-lg mb-4">
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between mb-3">
              <View className="flex flex-row items-center gap-2">
                <View className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center">
                  <Coins size={20} color="#ca8a04" />
                </View>
                <View>
                  <Text className="block text-xs text-stone-500 font-bold">成功账户余额</Text>
                  <View className="flex flex-row items-center gap-1">
                    <Sparkles size={14} color="#14b8a6" />
                    <Text className="block text-teal-500 text-2xl font-black">{totalCoins}</Text>
                    <Text className="block text-stone-400 text-xs font-bold">成功币</Text>
                  </View>
                </View>
              </View>
              <View
                className="rounded-xl bg-teal-400 border-2 border-teal-500 px-3 py-2 flex flex-row items-center gap-1"
                onClick={() => Taro.switchTab({ url: "/pages/deposit/index" })}
              >
                <Plus size={14} color="#fff" />
                <Text className="block text-white text-xs font-black">存款</Text>
              </View>
            </View>

            {/* 小统计条 */}
            <View className="flex flex-row gap-3">
              <View className="flex-1 rounded-xl bg-teal-50 border-2 border-teal-100 p-2 text-center">
                <Text className="block text-teal-600 text-lg font-black">{totalDeposits}</Text>
                <Text className="block text-xs text-stone-400 font-bold">总存款</Text>
              </View>
              <View className="flex-1 rounded-xl bg-orange-50 border-2 border-orange-100 p-2 text-center">
                <View className="flex flex-row items-center justify-center gap-1">
                  <Flame size={12} color="#ea580c" />
                  <Text className="block text-orange-600 text-lg font-black">{streak}</Text>
                </View>
                <Text className="block text-xs text-stone-400 font-bold">连续天数</Text>
              </View>
              <View className="flex-1 rounded-xl bg-yellow-50 border-2 border-yellow-100 p-2 text-center">
                <View className="flex flex-row items-center justify-center gap-1">
                  <Star size={12} color="#ca8a04" />
                  <Text className="block text-yellow-600 text-lg font-black">Lv.{Math.min(Math.floor(totalCoins / 100) + 1, 10)}</Text>
                </View>
                <Text className="block text-xs text-stone-400 font-bold">等级</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 今日任务 */}
        {todayTask && (
          <Card className="border-2 border-purple-200 bg-gradient-to-b from-purple-50 to-white shadow-md mb-4">
            <CardContent className="p-4">
              <View className="flex flex-row items-center justify-between mb-2">
                <View className="flex flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-lg bg-purple-100 border-2 border-purple-300 flex items-center justify-center">
                    <Zap size={16} color="#9333ea" />
                  </View>
                  <Text className="block text-sm font-black text-stone-800">今日任务</Text>
                </View>
                <Badge className={todayCompleted ? "bg-emerald-100 border-2 border-emerald-300 text-emerald-700" : "bg-purple-100 border-2 border-purple-300 text-purple-700"}>
                  <Text className="block text-xs font-bold">{todayCompleted ? "已完成" : "Day " + todayTask.day}</Text>
                </Badge>
              </View>
              <Text className="block text-sm text-stone-600 font-bold mb-2">{todayTask.title}</Text>
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-1 rounded-full bg-yellow-100 border border-yellow-300 px-2 py-1">
                  <Zap size={10} color="#ca8a04" />
                  <Text className="block text-yellow-700 text-xs font-black">+3 成功币</Text>
                </View>
                <View
                  className="flex flex-row items-center justify-end"
                  onClick={() => Taro.switchTab({ url: "/pages/tasks/index" })}
                >
                  <Text className="block text-purple-600 text-xs font-bold">查看详情</Text>
                  <ArrowRight size={12} color="#9333ea" />
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 成功花园入口 */}
        <Card className="border-2 border-green-300 bg-gradient-to-b from-green-50 to-amber-50 shadow-md mb-4">
          <CardContent className="p-4">
            <View
              style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
              onClick={() => Taro.navigateTo({ url: "/pages/garden/index" })}
            >
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View className="w-10 h-10 rounded-xl bg-green-100 border-2 border-green-300 flex items-center justify-center">
                  <TreePine size={20} color="#16a34a" />
                </View>
                <View style={{ marginLeft: "10px" }}>
                  <Text className="block text-sm font-black text-stone-800">成功花园</Text>
                  <Text className="block text-xs text-stone-500 font-bold">你的成功币在滋养一棵生命之树</Text>
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: "28px", marginRight: "4px" }}>🌳</Text>
                <ArrowRight size={16} color="#16a34a" />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 快速存款 */}
        <Text className="block text-base font-black text-stone-800 mb-2">快速存款</Text>
        <View className="flex flex-row flex-wrap gap-2 mb-4">
          {QUICK_DEPOSITS.map((item) => (
            <View
              key={item.label}
              className={`${item.color} rounded-xl px-3 py-2 flex flex-row items-center gap-1.5`}
              onClick={() => handleQuickDeposit(item.label)}
            >
              <item.icon size={14} color={item.iconColor} />
              <Text className={`block text-xs font-black ${item.textColor}`}>{item.label}</Text>
              <View className="flex flex-row items-center gap-0.5 ml-1">
                <Coins size={8} color="#ca8a04" />
                <Text className="block text-yellow-600 text-xs font-black">+1</Text>
              </View>
            </View>
          ))}
          <View
            className="bg-stone-100 border-2 border-dashed border-stone-300 rounded-xl px-3 py-2 flex flex-row items-center gap-1.5"
            onClick={() => Taro.switchTab({ url: "/pages/deposit/index" })}
          >
            <Plus size={14} color="#78716c" />
            <Text className="block text-xs font-bold text-stone-500">自定义</Text>
          </View>
        </View>

        {/* 快速存款成功提示 */}
        {quickDepositSuccess && (
          <Card className="border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white shadow-md mb-4">
            <CardContent className="p-3 flex flex-row items-center justify-center gap-2">
              <View className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                <Check size={12} color="#fff" />
              </View>
              <Text className="block text-sm text-emerald-700 font-bold">
                {quickDepositSuccess} +1 成功币!
              </Text>
            </CardContent>
          </Card>
        )}

        {/* 最近存款记录 */}
        <Text className="block text-base font-black text-stone-800 mb-2">最近存款</Text>
        {recentDeposits.length > 0 ? (
          <View className="flex flex-col gap-2 mb-4">
            {recentDeposits.map((deposit, idx) => (
              <Card key={deposit.id || idx} className="border-2 border-amber-200 shadow-sm">
                <CardContent className="p-3 flex flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-lg bg-teal-100 border-2 border-teal-300 flex items-center justify-center">
                    <Sparkles size={16} color="#14b8a6" />
                  </View>
                  <View className="flex-1">
                    <Text className="block text-sm text-stone-700 font-bold">{deposit.content}</Text>
                    <Text className="block text-xs text-stone-400 font-bold">{deposit.emotion} · {deposit.difficulty === "easy" ? "简单" : deposit.difficulty === "medium" ? "中等" : "困难"}</Text>
                  </View>
                  <View className="flex flex-row items-center gap-1 rounded-full bg-yellow-100 border-2 border-yellow-300 px-2 py-1">
                    <Coins size={10} color="#ca8a04" />
                    <Text className="block text-yellow-700 text-xs font-black">+{deposit.coins}</Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : (
          <Card className="border-2 border-amber-200 shadow-sm mb-4">
            <CardContent className="p-6 flex flex-col items-center">
              <View className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center mb-2">
                <Heart size={24} color="#ca8a04" />
              </View>
              <Text className="block text-sm text-stone-500 font-bold">还没有存款记录</Text>
              <Text className="block text-xs text-stone-400 font-bold mt-1">点击上方标签，存入你的第一笔成功</Text>
            </CardContent>
          </Card>
        )}

        {/* 每日鼓励 */}
        <Card className="border-2 border-yellow-300 bg-gradient-to-b from-yellow-50 to-amber-50 shadow-md mb-4">
          <CardContent className="p-3">
            <View className="flex flex-row items-center gap-2">
              <Star size={16} color="#ca8a04" />
              <Text className="block text-yellow-700 text-xs font-bold">
                你不需要变得完美才值得被爱。此刻的你，就已经足够好了。
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
