import { View, Text } from "@tarojs/components"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Network } from "@/network"
import { Star, Award, Trophy, Flame, TrendingUp, Target, Heart, Sparkles, Zap, Crown, Shield, Check } from "lucide-react-taro"

// 等级系统
const LEVELS = [
  { level: 1, name: "新手储户", minDeposits: 0, icon: Star },
  { level: 2, name: "勤奋存户", minDeposits: 10, icon: Heart },
  { level: 3, name: "成长达人", minDeposits: 30, icon: TrendingUp },
  { level: 4, name: "自信先锋", minDeposits: 60, icon: Target },
  { level: 5, name: "配得感新星", minDeposits: 100, icon: Sparkles },
  { level: 6, name: "突破行者", minDeposits: 150, icon: Zap },
  { level: 7, name: "勇气战士", minDeposits: 210, icon: Shield },
  { level: 8, name: "自我接纳者", minDeposits: 280, icon: Award },
  { level: 9, name: "配得感达人", minDeposits: 360, icon: Crown },
  { level: 10, name: "成功大师", minDeposits: 500, icon: Trophy },
]

// 成就勋章
const ACHIEVEMENTS = [
  { id: "streak_7", name: "坚持一周", desc: "连续存款7天", icon: Flame, color: "bg-amber-100 text-amber-600", category: "persistence" },
  { id: "streak_30", name: "月度之星", desc: "连续存款30天", icon: Flame, color: "bg-amber-100 text-amber-600", category: "persistence" },
  { id: "streak_100", name: "百日传奇", desc: "连续存款100天", icon: Flame, color: "bg-amber-100 text-amber-600", category: "persistence" },
  { id: "plan_21", name: "配得感大师", desc: "完成21天计划", icon: Crown, color: "bg-violet-100 text-violet-600", category: "growth" },
  { id: "challenge_10", name: "挑战勇士", desc: "完成10次微恐惧挑战", icon: Shield, color: "bg-emerald-100 text-emerald-600", category: "growth" },
  { id: "first_reject", name: "第一次说不", desc: "首次拒绝不合理请求", icon: Shield, color: "bg-rose-100 text-rose-600", category: "acceptance" },
  { id: "first_praise", name: "接受赞美", desc: "第一次接受赞美不反驳", icon: Heart, color: "bg-sky-100 text-sky-600", category: "acceptance" },
  { id: "deposit_50", name: "半百存户", desc: "累计存入50次成功", icon: Star, color: "bg-sky-100 text-sky-600", category: "milestone" },
  { id: "deposit_100", name: "百次见证", desc: "累计存入100次成功", icon: Trophy, color: "bg-amber-100 text-amber-600", category: "milestone" },
  { id: "gratitude_7", name: "感恩之心", desc: "连续7天写感恩日记", icon: Heart, color: "bg-emerald-100 text-emerald-600", category: "persistence" },
]

export default function ProfilePage() {
  const [stats, setStats] = useState({
    totalDeposits: 0,
    coins: 0,
    streak: 0,
    level: 1,
    levelName: "新手储户",
    completedTasks: 0,
    challengesCompleted: 0,
    gratitudeDays: 0,
  })
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"achievements" | "stats">("achievements")

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const [statsRes, achievementsRes] = await Promise.all([
        Network.request({ url: "/api/deposits/stats" }),
        Network.request({ url: "/api/achievements" }),
      ])
      console.log("Profile stats response:", statsRes.data)
      console.log("Achievements response:", achievementsRes.data)

      if (statsRes.data?.data) {
        setStats(statsRes.data.data)
      }
      if (achievementsRes.data?.data) {
        setUnlockedAchievements(achievementsRes.data.data.map((a: any) => a.achievement_id || a.id))
      }
    } catch (err) {
      console.log("Fetch profile data error:", err)
    }
  }

  const currentLevel = LEVELS.find(l => l.level === stats.level) || LEVELS[0]
  const nextLevel = LEVELS.find(l => l.level === stats.level + 1)
  const LevelIcon = currentLevel.icon

  const levelProgress = () => {
    if (!nextLevel) return 100
    const base = currentLevel.minDeposits
    const next = nextLevel.minDeposits
    return next > base ? Math.min(((stats.totalDeposits - base) / (next - base)) * 100, 100) : 100
  }

  return (
    <View className="min-h-full bg-gray-50 pb-20">
      {/* 顶部个人信息 */}
      <View className="bg-sky-500 px-4 pt-6 pb-8 rounded-b-3xl">
        <View className="flex flex-row items-center gap-3 mb-4">
          <View className="w-14 h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <LevelIcon size={28} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="block text-white text-lg font-bold">{"Lv." + stats.level + " " + stats.levelName}</Text>
            <Text className="block text-sky-100 text-xs">{"累计 " + stats.totalDeposits + " 次成功存款"}</Text>
          </View>
          <View className="bg-white bg-opacity-20 rounded-full px-3 py-1">
            <Text className="block text-white text-xs font-semibold">{stats.coins + " 成功币"}</Text>
          </View>
        </View>

        {/* 等级进度 */}
        {nextLevel && (
          <Card className="bg-white bg-opacity-95 border-0 shadow-lg">
            <CardContent className="p-3">
              <View className="flex flex-row items-center justify-between mb-1">
                <Text className="block text-xs text-gray-500">{"Lv." + stats.level + " " + currentLevel.name}</Text>
                <Text className="block text-xs text-gray-500">{"Lv." + nextLevel.level + " " + nextLevel.name}</Text>
              </View>
              <Progress value={levelProgress()} className="h-2" />
              <Text className="block text-xs text-gray-400 mt-1 text-center">
                {"还需 " + (nextLevel.minDeposits - stats.totalDeposits) + " 次存款升级"}
              </Text>
            </CardContent>
          </Card>
        )}
      </View>

      {/* 数据概览 */}
      <View className="px-4 mt-4">
        <View className="flex flex-row gap-3">
          <View className="flex-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3 flex flex-col items-center">
                <Flame size={20} color="#f59e0b" />
                <Text className="block text-lg font-bold text-gray-800 mt-1">{stats.streak}</Text>
                <Text className="block text-xs text-gray-400">连续天数</Text>
              </CardContent>
            </Card>
          </View>
          <View className="flex-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3 flex flex-col items-center">
                <Target size={20} color="#0ea5e9" />
                <Text className="block text-lg font-bold text-gray-800 mt-1">{stats.completedTasks + "/21"}</Text>
                <Text className="block text-xs text-gray-400">任务完成</Text>
              </CardContent>
            </Card>
          </View>
          <View className="flex-1">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3 flex flex-col items-center">
                <Shield size={20} color="#10b981" />
                <Text className="block text-lg font-bold text-gray-800 mt-1">{stats.challengesCompleted}</Text>
                <Text className="block text-xs text-gray-400">挑战完成</Text>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>

      {/* Tab 切换 */}
      <View className="px-4 mt-4">
        <View className="flex flex-row bg-gray-100 rounded-xl p-1">
          <View
            className={`flex-1 py-2 rounded-lg ${activeTab === "achievements" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setActiveTab("achievements")}
          >
            <Text className={`block text-center text-sm font-medium ${activeTab === "achievements" ? "text-sky-600" : "text-gray-500"}`}>
              成就勋章
            </Text>
          </View>
          <View
            className={`flex-1 py-2 rounded-lg ${activeTab === "stats" ? "bg-white shadow-sm" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <Text className={`block text-center text-sm font-medium ${activeTab === "stats" ? "text-sky-600" : "text-gray-500"}`}>
              等级体系
            </Text>
          </View>
        </View>
      </View>

      {/* 成就勋章 */}
      {activeTab === "achievements" && (
        <View className="px-4 mt-4">
          <View className="flex flex-row items-center justify-between mb-3">
            <Text className="block text-sm font-semibold text-gray-700">{"已解锁 " + unlockedAchievements.length + "/" + ACHIEVEMENTS.length}</Text>
          </View>
          <View className="flex flex-row flex-wrap gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlockedAchievements.includes(ach.id)
              const AchIcon = ach.icon
              return (
                <View
                  key={ach.id}
                  className={`w-[calc(50%-6px)] rounded-2xl p-3 ${isUnlocked ? "bg-white shadow-sm" : "bg-gray-100 opacity-60"}`}
                >
                  <View className="flex flex-row items-center gap-2">
                    <View className={`w-10 h-10 rounded-xl ${isUnlocked ? ach.color : "bg-gray-200"} flex items-center justify-center`}>
                      <AchIcon size={20} color={isUnlocked ? "#0ea5e9" : "#9ca3af"} />
                    </View>
                    <View className="flex-1">
                      <Text className={`block text-sm font-medium ${isUnlocked ? "text-gray-800" : "text-gray-400"}`}>
                        {ach.name}
                      </Text>
                      <Text className="block text-xs text-gray-400">{ach.desc}</Text>
                    </View>
                    {isUnlocked && (
                      <Check size={16} color="#10b981" />
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      )}

      {/* 等级体系 */}
      {activeTab === "stats" && (
        <View className="px-4 mt-4">
          <View className="flex flex-col gap-2">
            {LEVELS.map((lv) => {
              const isCurrent = lv.level === stats.level
              const isUnlocked = stats.totalDeposits >= lv.minDeposits
              const LvIcon = lv.icon
              return (
                <Card
                  key={lv.level}
                  className={`border-0 shadow-sm ${isCurrent ? "border-l-4 border-l-sky-500" : ""}`}
                >
                  <CardContent className="p-3">
                    <View className="flex flex-row items-center gap-3">
                      <View className={`w-10 h-10 rounded-xl ${
                        isUnlocked ? "bg-sky-100" : "bg-gray-100"
                      } flex items-center justify-center`}
                      >
                        <LvIcon size={20} color={isUnlocked ? "#0ea5e9" : "#9ca3af"} />
                      </View>
                      <View className="flex-1">
                        <View className="flex flex-row items-center gap-2">
                          <Text className="block text-sm font-semibold text-gray-700">
                            {"Lv." + lv.level + " " + lv.name}
                          </Text>
                          {isCurrent && (
                            <Badge variant="default">
                              <Text className="block text-xs">当前</Text>
                            </Badge>
                          )}
                        </View>
                        <Text className="block text-xs text-gray-400">{"需要 " + lv.minDeposits + " 次成功存款"}</Text>
                      </View>
                      {isUnlocked ? (
                        <Check size={16} color="#10b981" />
                      ) : (
                        <Sparkles size={16} color="#cbd5e1" />
                      )}
                    </View>
                  </CardContent>
                </Card>
              )
            })}
          </View>
        </View>
      )}

      {/* 底部鼓励 */}
      <View className="px-4 mt-4 mb-4">
        <Card className="border-0 shadow-sm bg-amber-50">
          <CardContent className="p-3">
            <Text className="block text-amber-700 text-xs text-center">
              每一次存款都是对自己的认可，你的成长值得被看见。
            </Text>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
