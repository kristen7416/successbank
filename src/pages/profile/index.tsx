import { View, Text } from "@tarojs/components"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Network } from "@/network"
import { Star, Trophy, Heart, Shield, Flame, Crown, Medal, Sparkles, Target, Zap, Check } from "lucide-react-taro"

const LEVELS = [
  { name: "新手储户", minCoins: 0, icon: Star },
  { name: "见习储蓄员", minCoins: 10, icon: Star },
  { name: "储蓄达人", minCoins: 50, icon: Medal },
  { name: "自信存户", minCoins: 100, icon: Medal },
  { name: "成长之星", minCoins: 200, icon: Trophy },
  { name: "配得感探索者", minCoins: 350, icon: Trophy },
  { name: "勇敢储户", minCoins: 500, icon: Crown },
  { name: "成功理财师", minCoins: 750, icon: Crown },
  { name: "配得感大师", minCoins: 1000, icon: Crown },
  { name: "成功银行家", minCoins: 1500, icon: Crown },
]

const ACHIEVEMENTS = [
  { id: "first_deposit", name: "第一桶金", desc: "存入第一笔成功", icon: Star, color: "bg-yellow-100 border-2 border-yellow-300", iconColor: "#ca8a04" },
  { id: "streak_7", name: "七天坚持", desc: "连续存款7天", icon: Flame, color: "bg-orange-100 border-2 border-orange-300", iconColor: "#ea580c" },
  { id: "streak_30", name: "月度达人", desc: "连续存款30天", icon: Flame, color: "bg-red-100 border-2 border-red-300", iconColor: "#dc2626" },
  { id: "streak_100", name: "百日传奇", desc: "连续存款100天", icon: Crown, color: "bg-purple-100 border-2 border-purple-300", iconColor: "#9333ea" },
  { id: "plan_21", name: "配得感大师", desc: "完成21天计划", icon: Trophy, color: "bg-teal-100 border-2 border-teal-300", iconColor: "#14b8a6" },
  { id: "first_reject", name: "勇敢说不", desc: "第一次拒绝别人", icon: Shield, color: "bg-pink-100 border-2 border-pink-300", iconColor: "#db2777" },
  { id: "accept_praise", name: "接受赞美", desc: "第一次接受赞美不反驳", icon: Heart, color: "bg-red-100 border-2 border-red-300", iconColor: "#e11d48" },
  { id: "challenge_10", name: "挑战先锋", desc: "完成10次微恐惧挑战", icon: Target, color: "bg-emerald-100 border-2 border-emerald-300", iconColor: "#059669" },
  { id: "coins_500", name: "半千富豪", desc: "累计500成功币", icon: Zap, color: "bg-yellow-100 border-2 border-yellow-300", iconColor: "#ca8a04" },
  { id: "coins_1000", name: "千金富翁", desc: "累计1000成功币", icon: Crown, color: "bg-purple-100 border-2 border-purple-300", iconColor: "#9333ea" },
]

export default function ProfilePage() {
  const [totalCoins, setTotalCoins] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [streak, setStreak] = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const [statsRes, achievementsRes] = await Promise.all([
        Network.request({ url: "/api/deposits/stats" }),
        Network.request({ url: "/api/achievements" }),
      ])
      console.log("Stats response:", statsRes.data)
      console.log("Achievements response:", achievementsRes.data)

      if (statsRes.data?.data) {
        const stats = statsRes.data.data
        setTotalCoins(stats.total_coins || 0)
        setTotalDeposits(stats.total_deposits || 0)
        setStreak(stats.streak || 0)
      }

      if (achievementsRes.data?.data) {
        const achs = achievementsRes.data.data
        setUnlockedAchievements(achs.map((a: { achievement_id: string }) => a.achievement_id))
      }
    } catch (err) {
      console.log("Fetch profile error:", err)
    }
  }

  const currentLevel = LEVELS.reduce((acc, level) => {
    return totalCoins >= level.minCoins ? level : acc
  }, LEVELS[0])

  const currentLevelIdx = LEVELS.indexOf(currentLevel)
  const nextLevel = LEVELS[currentLevelIdx + 1]
  const levelProgress = nextLevel
    ? ((totalCoins - currentLevel.minCoins) / (nextLevel.minCoins - currentLevel.minCoins)) * 100
    : 100

  const LevelIcon = currentLevel.icon

  return (
    <View className="min-h-full bg-amber-50 pb-20">
      {/* 等级面板 - 游戏风格 */}
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

        {/* 成就勋章 */}
        <Text className="block text-base font-black text-stone-800 mb-3">成就勋章</Text>
        <View className="flex flex-row flex-wrap gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedAchievements.includes(ach.id)
            const AchIcon = ach.icon
            return (
              <Card
                key={ach.id}
                className={`w-[calc(50%-6px)] border-2 shadow-sm ${
                  unlocked
                    ? ach.color
                    : "bg-stone-50 border-stone-200 opacity-40"
                }`}
              >
                <CardContent className="p-3 flex flex-row items-center gap-2">
                  <View className={`w-10 h-10 rounded-xl flex items-center justify-center ${unlocked ? ach.color : "bg-stone-100 border-2 border-stone-200"}`}>
                    {unlocked ? (
                      <AchIcon size={20} color={ach.iconColor} />
                    ) : (
                      <AchIcon size={20} color="#a8a29e" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className={`block text-xs font-black ${unlocked ? "text-stone-800" : "text-stone-400"}`}>
                      {ach.name}
                    </Text>
                    <Text className="block text-xs text-stone-400 font-bold">{ach.desc}</Text>
                    {unlocked && (
                      <View className="flex flex-row items-center gap-1 mt-1">
                        <Check size={10} color="#14b8a6" />
                        <Text className="block text-xs text-teal-600 font-bold">已解锁</Text>
                      </View>
                    )}
                  </View>
                </CardContent>
              </Card>
            )
          })}
        </View>

        {/* 等级一览 */}
        <Text className="block text-base font-black text-stone-800 mb-3 mt-4">等级一览</Text>
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
