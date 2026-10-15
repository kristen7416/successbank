import { View, Text } from "@tarojs/components"
import { useState, useEffect, useCallback } from "react"
import Taro, { useDidShow } from "@tarojs/taro"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Network } from "@/network"
import { Star, Trophy, Flame, Crown, Medal, Sparkles, Check, TreePine, ArrowRight } from "lucide-react-taro"

const LEVELS = [
  { name: "新手储户", minCoins: 0, icon: Star },
  { name: "见习储蓄员", minCoins: 5, icon: Star },
  { name: "储蓄达人", minCoins: 10, icon: Medal },
  { name: "自信存户", minCoins: 16, icon: Medal },
  { name: "成长之星", minCoins: 23, icon: Trophy },
  { name: "配得感探索者", minCoins: 31, icon: Trophy },
  { name: "勇敢储户", minCoins: 40, icon: Crown },
  { name: "成功理财师", minCoins: 50, icon: Crown },
  { name: "配得感大师", minCoins: 60, icon: Crown },
  { name: "成功银行家", minCoins: 70, icon: Crown },
]

const CATEGORY_META = {
  deposit: { name: "存款达人", color: "bg-yellow-100 border-2 border-yellow-300", textColor: "text-yellow-700" },
  streak: { name: "坚持之星", color: "bg-orange-100 border-2 border-orange-300", textColor: "text-orange-700" },
  coins: { name: "财富积累", color: "bg-amber-100 border-2 border-amber-300", textColor: "text-amber-700" },
  task: { name: "任务冒险", color: "bg-purple-100 border-2 border-purple-300", textColor: "text-purple-700" },
  toolbox: { name: "工具专家", color: "bg-teal-100 border-2 border-teal-300", textColor: "text-teal-700" },
  tree: { name: "花园守护", color: "bg-green-100 border-2 border-green-300", textColor: "text-green-700" },
}

interface Achievement {
  id: string
  name: string
  desc: string
  category: string
  icon: string
  threshold: number
  field: string
  unlocked: boolean
  unlocked_at: string | null
  current_value?: number
}

export default function ProfilePage() {
  const [totalCoins, setTotalCoins] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const fetchProfileData = useCallback(async () => {
    try {
      const [statsRes, achievementsRes] = await Promise.all([
        Network.request({ url: "/api/deposits/stats" }),
        Network.request({ url: "/api/achievements" }),
      ])
      console.log("[ProfilePage] Stats response:", statsRes?.data)
      console.log("[ProfilePage] Achievements response:", achievementsRes?.data)

      const stats = statsRes?.data?.data ?? statsRes?.data
      if (stats) {
        setTotalCoins(Number(stats.total_coins ?? stats.totalCoins) || 0)
        setTotalDeposits(Number(stats.total_deposits ?? stats.totalDeposits) || 0)
        setStreak(Number(stats.streak) || 0)
      }

      const achData = achievementsRes?.data?.data ?? achievementsRes?.data
      if (Array.isArray(achData)) {
        setAchievements(achData)
      }
    } catch (err) {
      console.log("[ProfilePage] Fetch profile error:", err)
    }
  }, [])

  useDidShow(() => {
    fetchProfileData()
  })

  useEffect(() => {
    fetchProfileData()

    const handleUpdate = () => {
      fetchProfileData()
    }

    Taro.eventCenter.on('SUCCESSBANK_DATA_UPDATED', handleUpdate)
    if (typeof window !== 'undefined') {
      window.addEventListener('successbank_data_updated', handleUpdate)
    }

    return () => {
      Taro.eventCenter.off('SUCCESSBANK_DATA_UPDATED', handleUpdate)
      if (typeof window !== 'undefined') {
        window.removeEventListener('successbank_data_updated', handleUpdate)
      }
    }
  }, [fetchProfileData])

  const currentLevel = LEVELS.reduce((acc, level) => {
    return totalCoins >= level.minCoins ? level : acc
  }, LEVELS[0])

  const currentLevelIdx = LEVELS.indexOf(currentLevel)
  const nextLevel = LEVELS[currentLevelIdx + 1]
  const levelProgress = nextLevel
    ? ((totalCoins - currentLevel.minCoins) / (nextLevel.minCoins - currentLevel.minCoins)) * 100
    : 100

  const LevelIcon = currentLevel.icon
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, ach) => {
    if (!acc[ach.category]) acc[ach.category] = []
    acc[ach.category].push(ach)
    return acc
  }, {} as Record<string, Achievement[]>)

  return (
    <View className="min-h-full bg-amber-50 pb-20">
      {/* 等级面板 */}
      <View className="bg-gradient-to-b from-teal-400 to-teal-500 px-4 pt-4 pb-8 rounded-b-[2rem]">
        <View className="flex flex-col items-center">
          <View className="w-16 h-16 rounded-full bg-yellow-100 border-4 border-yellow-300 flex items-center justify-center mb-2">
            <LevelIcon size={32} color="#ca8a04" />
          </View>
          <Text className="block text-white text-lg font-black">{currentLevel.name}</Text>
          <Text className="block text-teal-100 text-xs font-bold mt-1">Lv.{currentLevelIdx + 1}</Text>
        </View>
      </View>

      <View className="px-4 -mt-4">
        {/* 升级进度 */}
        {nextLevel && (
          <Card className="border-2 border-yellow-300 bg-gradient-to-b from-yellow-50 to-amber-50 shadow-lg mb-4">
            <CardContent className="p-4">
              <View className="flex flex-row items-center justify-between mb-2">
                <Text className="block text-xs text-stone-500 font-bold">{currentLevel.name}</Text>
                <View className="flex flex-row items-center gap-1">
                  <Sparkles size={12} color="#ca8a04" />
                  <Text className="block text-yellow-700 text-xs font-black">{totalCoins}/{nextLevel.minCoins}</Text>
                </View>
                <Text className="block text-xs text-stone-500 font-bold">{nextLevel.name}</Text>
              </View>
              <Progress value={levelProgress} className="h-3" />
              <Text className="block text-center text-xs text-yellow-600 font-bold mt-1">
                还差 {nextLevel.minCoins - totalCoins} 成功币升级
              </Text>
            </CardContent>
          </Card>
        )}

        {/* 数据面板 */}
        <View className="flex flex-row gap-3 mb-4">
          <Card className="flex-1 border-2 border-teal-200 bg-gradient-to-b from-teal-50 to-white shadow-sm">
            <CardContent className="p-3 flex flex-col items-center">
              <Sparkles size={18} color="#14b8a6" />
              <Text className="block text-xl font-black text-teal-600 mt-1">{totalCoins}</Text>
              <Text className="block text-xs text-stone-500 font-bold">成功币</Text>
            </CardContent>
          </Card>
          <Card className="flex-1 border-2 border-yellow-200 bg-gradient-to-b from-yellow-50 to-white shadow-sm">
            <CardContent className="p-3 flex flex-col items-center">
              <Star size={18} color="#ca8a04" />
              <Text className="block text-xl font-black text-yellow-600 mt-1">{totalDeposits}</Text>
              <Text className="block text-xs text-stone-500 font-bold">总存款</Text>
            </CardContent>
          </Card>
          <Card className="flex-1 border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-white shadow-sm">
            <CardContent className="p-3 flex flex-col items-center">
              <Flame size={18} color="#ea580c" />
              <Text className="block text-xl font-black text-orange-600 mt-1">{streak}</Text>
              <Text className="block text-xs text-stone-500 font-bold">连续天数</Text>
            </CardContent>
          </Card>
        </View>

        {/* 花园入口 */}
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
                  <Text className="block text-xs text-stone-500 font-bold">你的成功币在滋养生命之树</Text>
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: "24px", marginRight: "4px" }}>🌳</Text>
                <ArrowRight size={16} color="#16a34a" />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 成就总览 */}
        <View className="flex flex-row items-center justify-between mb-3">
          <Text className="block text-base font-black text-stone-800">成就勋章</Text>
          <Badge className="bg-teal-100 border-2 border-teal-300 text-teal-700">
            <Text className="block text-xs font-bold">{unlockedCount}/{totalCount}</Text>
          </Badge>
        </View>

        {/* 分类别展示成就 */}
        {Object.entries(groupedAchievements).map(([category, achs]) => {
          const meta = CATEGORY_META[category] || { name: category, color: "bg-stone-100 border-2 border-stone-300", textColor: "text-stone-700" }
          const categoryUnlocked = achs.filter(a => a.unlocked).length
          return (
            <View key={category} className="mb-4">
              <View className="flex flex-row items-center gap-2 mb-2">
                <View className={`rounded-full px-2 py-1 ${meta.color}`}>
                  <Text className={`block text-xs font-black ${meta.textColor}`}>{meta.name}</Text>
                </View>
                <Text className="block text-xs text-stone-400 font-bold">{categoryUnlocked}/{achs.length}</Text>
              </View>
              <View className="flex flex-row flex-wrap gap-2">
                {achs.map((ach) => (
                  <Card
                    key={ach.id}
                    className={`border-2 shadow-sm ${ach.unlocked ? meta.color : "bg-stone-50 border-stone-200 opacity-40"}`}
                    style={{ width: "calc(50% - 4px)" }}
                  >
                    <CardContent className="p-3">
                      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
                        <Text style={{ fontSize: "22px", opacity: ach.unlocked ? 1 : 0.4 }}>{ach.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text className={`block text-xs font-black ${ach.unlocked ? "text-stone-800" : "text-stone-400"}`}>
                            {ach.name}
                          </Text>
                          <Text className="block text-xs text-stone-400 font-bold">{ach.desc}</Text>
                          {ach.unlocked ? (
                            <View className="flex flex-row items-center gap-1 mt-1">
                              <Check size={10} color="#14b8a6" />
                              <Text className="block text-xs text-teal-600 font-bold">已解锁</Text>
                            </View>
                          ) : (
                            <View className="mt-1">
                              <View style={{ width: "100%", height: "4px", borderRadius: "2px", backgroundColor: "#e7e5e4" }}>
                                <View
                                  style={{
                                    width: Math.min(100, Math.round(((ach.current_value || 0) / ach.threshold) * 100)) + "%",
                                    height: "100%",
                                    borderRadius: "2px",
                                    backgroundColor: "#94a3b8",
                                  }}
                                />
                              </View>
                              <Text className="block text-xs text-stone-400 font-bold mt-1">
                                {ach.current_value || 0}/{ach.threshold}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </View>
            </View>
          )
        })}

        {/* 等级一览 */}
        <Text className="block text-base font-black text-stone-800 mb-3 mt-2">等级一览</Text>
        <View className="flex flex-col gap-2 mb-4">
          {LEVELS.map((level, idx) => {
            const isCurrent = idx === currentLevelIdx
            const isReached = totalCoins >= level.minCoins
            const LevelIc = level.icon
            return (
              <Card
                key={idx}
                className={`border-2 shadow-sm ${
                  isCurrent
                    ? "border-teal-300 bg-gradient-to-b from-teal-50 to-white"
                    : isReached
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-stone-200 bg-stone-50 opacity-50"
                }`}
              >
                <CardContent className="p-3 flex flex-row items-center gap-3">
                  <View className={`w-9 h-9 rounded-lg flex items-center justify-center ${isCurrent ? "bg-teal-100 border-2 border-teal-300" : isReached ? "bg-emerald-100 border-2 border-emerald-300" : "bg-stone-100 border-2 border-stone-200"}`}>
                    <LevelIc size={18} color={isReached ? "#14b8a6" : "#a8a29e"} />
                  </View>
                  <View className="flex-1">
                    <View className="flex flex-row items-center gap-2">
                      <Text className={`block text-sm font-black ${isCurrent ? "text-teal-600" : isReached ? "text-emerald-600" : "text-stone-400"}`}>
                        Lv.{idx + 1} {level.name}
                      </Text>
                      {isCurrent && (
                        <Badge className="bg-teal-400 text-white text-xs font-bold">
                          <Text className="block text-xs font-bold">当前</Text>
                        </Badge>
                      )}
                    </View>
                    <Text className="block text-xs text-stone-400 font-bold">
                      {idx === 0 ? "起始等级" : level.minCoins + " 成功币解锁"}
                    </Text>
                  </View>
                </CardContent>
              </Card>
            )
          })}
        </View>
      </View>
    </View>
  )
}
