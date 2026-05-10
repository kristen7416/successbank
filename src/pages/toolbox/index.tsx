import { View, Text } from "@tarojs/components"
import { useState, useEffect } from "react"
import Taro from "@tarojs/taro"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Network } from "@/network"
import { Heart, Star, Sparkles, BookOpen, Shield, Sun, PenLine, RefreshCw, Check, ArrowLeft, Zap } from "lucide-react-taro"

// 自我肯定语句
const AFFIRMATIONS = [
  "我值得被爱和被尊重",
  "我的感受很重要",
  "我允许自己不完美",
  "我正在成为更好的自己",
  "我有权利追求自己的幸福",
  "我的存在本身就是有价值的",
  "我值得拥有美好的事物",
  "我接受自己的所有情绪",
  "我有能力面对生活中的挑战",
  "我为自己感到骄傲",
  "我值得被认真对待",
  "我的需要和别人一样重要",
]

// 工具类型
type ToolType = "home" | "affirmation" | "gratitude" | "value-map" | "fear-challenge"

export default function ToolboxPage() {
  const [activeTool, setActiveTool] = useState<ToolType>("home")

  // 自我肯定
  const [affirmation, setAffirmation] = useState("")
  const [affirmationSaved, setAffirmationSaved] = useState(false)

  // 感恩日记
  const [gratitude1, setGratitude1] = useState("")
  const [gratitude2, setGratitude2] = useState("")
  const [gratitude3, setGratitude3] = useState("")
  const [gratitudeSaved, setGratitudeSaved] = useState(false)

  // 价值条件化
  const [valueConditions, setValueConditions] = useState<{condition: string, rewrite: string}[]>([
    { condition: "", rewrite: "" }
  ])
  const [valueSaved, setValueSaved] = useState(false)

  // 微恐惧挑战
  const [challengeAccepted, setChallengeAccepted] = useState(false)

  useEffect(() => {
    generateAffirmation()
  }, [])

  const generateAffirmation = () => {
    const random = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
    setAffirmation(random)
    setAffirmationSaved(false)
  }

  const saveAffirmation = async () => {
    try {
      await Network.request({
        url: "/api/toolbox/affirmation",
        method: "POST",
        data: { content: affirmation },
      })
      setAffirmationSaved(true)
    } catch (err) {
      console.log("Save affirmation error:", err)
      setAffirmationSaved(true) // Optimistic
    }
  }

  const saveGratitude = async () => {
    try {
      await Network.request({
        url: "/api/toolbox/gratitude",
        method: "POST",
        data: { items: [gratitude1, gratitude2, gratitude3].filter(Boolean) },
      })
      setGratitudeSaved(true)
    } catch (err) {
      console.log("Save gratitude error:", err)
      setGratitudeSaved(true)
    }
  }

  const saveValueConditions = async () => {
    try {
      await Network.request({
        url: "/api/toolbox/value-conditions",
        method: "POST",
        data: { conditions: valueConditions.filter(v => v.condition.trim()) },
      })
      setValueSaved(true)
    } catch (err) {
      console.log("Save value conditions error:", err)
      setValueSaved(true)
    }
  }

  const addValueCondition = () => {
    setValueConditions([...valueConditions, { condition: "", rewrite: "" }])
  }

  // 工具箱首页
  if (activeTool === "home") {
    return (
      <View className="min-h-full bg-gray-50 pb-20">
        <View className="px-4 pt-4">
          <Text className="block text-lg font-semibold text-gray-800 mb-1">心理工具箱</Text>
          <Text className="block text-sm text-gray-500 mb-4">经过心理学验证的配得感提升工具</Text>

          <View className="flex flex-col gap-3">
            {/* 自我肯定 */}
            <Card className="border-0 shadow-sm" onClick={() => setActiveTool("affirmation")}>
              <CardContent className="p-4 flex flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Sun size={20} color="#0ea5e9" />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm font-semibold text-gray-800">每日自我肯定</Text>
                  <Text className="block text-xs text-gray-500">用肯定语句重塑内在信念</Text>
                </View>
                <Sparkles size={16} color="#94a3b8" />
              </CardContent>
            </Card>

            {/* 感恩日记 */}
            <Card className="border-0 shadow-sm" onClick={() => setActiveTool("gratitude")}>
              <CardContent className="p-4 flex flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Heart size={20} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm font-semibold text-gray-800">感恩日记</Text>
                  <Text className="block text-xs text-gray-500">记录3件值得感恩的小事</Text>
                </View>
                <Sparkles size={16} color="#94a3b8" />
              </CardContent>
            </Card>

            {/* 价值条件化地图 */}
            <Card className="border-0 shadow-sm" onClick={() => setActiveTool("value-map")}>
              <CardContent className="p-4 flex flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <BookOpen size={20} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm font-semibold text-gray-800">价值条件化地图</Text>
                  <Text className="block text-xs text-gray-500">识别和重写你的价值条件</Text>
                </View>
                <Sparkles size={16} color="#94a3b8" />
              </CardContent>
            </Card>

            {/* 微恐惧挑战 */}
            <Card className="border-0 shadow-sm" onClick={() => setActiveTool("fear-challenge")}>
              <CardContent className="p-4 flex flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Shield size={20} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm font-semibold text-gray-800">微恐惧挑战</Text>
                  <Text className="block text-xs text-gray-500">走出舒适区，赢取额外成功币</Text>
                </View>
                <Sparkles size={16} color="#94a3b8" />
              </CardContent>
            </Card>
          </View>

          {/* 今日一句话 */}
          <View className="mt-4 mb-4">
            <Card className="border-0 shadow-sm bg-sky-50">
              <CardContent className="p-4">
                <Text className="block text-sky-800 text-sm text-center italic">
                  工具只是开始，真正的改变来自你每一次勇敢的尝试。
                </Text>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>
    )
  }

  // 自我肯定工具
  if (activeTool === "affirmation") {
    return (
      <View className="min-h-full bg-gray-50 pb-20">
        <View className="px-4 pt-4">
          <View className="flex flex-row items-center gap-2 mb-4" onClick={() => setActiveTool("home")}>
            <ArrowLeft size={20} color="#0ea5e9" />
            <Text className="block text-sky-500 text-sm">返回工具箱</Text>
          </View>

          <Text className="block text-lg font-semibold text-gray-800 mb-1">每日自我肯定</Text>
          <Text className="block text-sm text-gray-500 mb-4">
            每天读一遍肯定语句，逐渐重塑你内心的信念系统
          </Text>

          {/* 今日肯定 */}
          <Card className="border-0 shadow-sm mb-4 bg-gradient-to-br from-sky-50 to-violet-50">
            <CardContent className="p-6">
              <View className="flex flex-col items-center">
                <Sun size={32} color="#0ea5e9" className="mb-3" />
                <Text className="block text-lg font-semibold text-gray-800 text-center leading-relaxed">
                  {affirmation}
                </Text>
              </View>
            </CardContent>
          </Card>

          <View className="flex flex-row gap-3 mb-4">
            <View className="flex-1">
              <Button variant="outline" className="w-full" onClick={generateAffirmation}>
                <RefreshCw size={14} color="#0ea5e9" />
                <Text className="block text-sm text-sky-600 ml-1">换一句</Text>
              </Button>
            </View>
            <View className="flex-1">
              <Button className="w-full" onClick={saveAffirmation}>
                {affirmationSaved ? <Check size={14} color="#fff" /> : <Star size={14} color="#fff" />}
                <Text className="block text-sm text-white ml-1">{affirmationSaved ? "已收藏" : "收藏"}</Text>
              </Button>
            </View>
          </View>

          {/* 心理学原理 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">为什么自我肯定有效？</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Text className="block text-xs text-gray-500 leading-relaxed">
                自我肯定理论（Self-Affirmation Theory）由Claude Steele提出。研究表明，当人们面对威胁自我完整性的事件时，肯定自己的核心价值可以帮助减少防御性反应，提升心理弹性。每天重复肯定语句，能逐渐改变你的自我对话模式。
              </Text>
            </CardContent>
          </Card>
        </View>
      </View>
    )
  }

  // 感恩日记
  if (activeTool === "gratitude") {
    return (
      <View className="min-h-full bg-gray-50 pb-20">
        <View className="px-4 pt-4">
          <View className="flex flex-row items-center gap-2 mb-4" onClick={() => setActiveTool("home")}>
            <ArrowLeft size={20} color="#f59e0b" />
            <Text className="block text-amber-500 text-sm">返回工具箱</Text>
          </View>

          <Text className="block text-lg font-semibold text-gray-800 mb-1">感恩日记</Text>
          <Text className="block text-sm text-gray-500 mb-4">
            写下今天3件值得感恩的小事，培养发现美好的能力
          </Text>

          <Card className="border-0 shadow-sm mb-4">
            <CardContent className="p-4">
              <View className="flex flex-col gap-3">
                {[gratitude1, gratitude2, gratitude3].map((val, idx) => {
                  const labels = ["第一件感恩的事", "第二件感恩的事", "第三件感恩的事"]
                  const setters = [setGratitude1, setGratitude2, setGratitude3]
                  return (
                    <View key={idx}>
                      <View className="flex flex-row items-center gap-2 mb-1">
                        <View className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                          <Text className="block text-amber-600 text-xs font-bold">{idx + 1}</Text>
                        </View>
                        <Text className="block text-xs text-gray-500">{labels[idx]}</Text>
                      </View>
                      <View className="bg-gray-50 rounded-xl p-3">
                        <Input
                          className="w-full bg-transparent"
                          placeholder="可以是很小的事..."
                          value={val}
                          onInput={(e) => setters[idx](e.detail.value)}
                        />
                      </View>
                    </View>
                  )
                })}
              </View>
            </CardContent>
          </Card>

          <Button
            className="w-full mb-4"
            disabled={gratitudeSaved || (!gratitude1 && !gratitude2 && !gratitude3)}
            onClick={saveGratitude}
          >
            {gratitudeSaved ? <Check size={14} color="#fff" /> : <Heart size={14} color="#fff" />}
            <Text className="block text-sm text-white ml-1">{gratitudeSaved ? "已保存" : "保存感恩日记"}</Text>
          </Button>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">感恩的力量</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Text className="block text-xs text-gray-500 leading-relaxed">
                Robert Emmons的研究表明，坚持写感恩日记可以提升25%的幸福感，改善睡眠质量，增强免疫系统。感恩不是忽视困难，而是在困难中也能发现值得珍惜的事物。
              </Text>
            </CardContent>
          </Card>
        </View>
      </View>
    )
  }

  // 价值条件化地图
  if (activeTool === "value-map") {
    return (
      <View className="min-h-full bg-gray-50 pb-20">
        <View className="px-4 pt-4">
          <View className="flex flex-row items-center gap-2 mb-4" onClick={() => setActiveTool("home")}>
            <ArrowLeft size={20} color="#8b5cf6" />
            <Text className="block text-violet-500 text-sm">返回工具箱</Text>
          </View>

          <Text className="block text-lg font-semibold text-gray-800 mb-1">价值条件化地图</Text>
          <Text className="block text-sm text-gray-500 mb-4">
            识别我必须...才值得的条件，并重写为无条件自我接纳
          </Text>

          <Card className="border-0 shadow-sm mb-4 bg-violet-50">
            <CardContent className="p-4">
              <Text className="block text-violet-700 text-sm text-center">
                我不需要满足任何条件，本身就值得被爱和尊重。
              </Text>
            </CardContent>
          </Card>

          <View className="flex flex-col gap-3">
            {valueConditions.map((item, idx) => (
              <Card key={idx} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-2 mb-2">
                    <Badge variant="destructive">
                      <Text className="block text-xs">{"条件 " + (idx + 1)}</Text>
                    </Badge>
                  </View>
                  <Text className="block text-xs text-gray-500 mb-1">我的条件信念：</Text>
                  <View className="bg-rose-50 rounded-xl p-3 mb-3">
                    <Input
                      className="w-full bg-transparent"
                      placeholder="例如：我必须完美才值得被爱"
                      value={item.condition}
                      onInput={(e) => {
                        const newConditions = [...valueConditions]
                        newConditions[idx] = { ...newConditions[idx], condition: e.detail.value }
                        setValueConditions(newConditions)
                      }}
                    />
                  </View>
                  <Text className="block text-xs text-gray-500 mb-1">重写为：</Text>
                  <View className="bg-emerald-50 rounded-xl p-3">
                    <Input
                      className="w-full bg-transparent"
                      placeholder="例如：我不需要完美，我本就值得被爱"
                      value={item.rewrite}
                      onInput={(e) => {
                        const newConditions = [...valueConditions]
                        newConditions[idx] = { ...newConditions[idx], rewrite: e.detail.value }
                        setValueConditions(newConditions)
                      }}
                    />
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>

          <View className="flex flex-row gap-3 mt-3 mb-4">
            <View className="flex-1">
              <Button variant="outline" className="w-full" onClick={addValueCondition}>
                <PenLine size={14} color="#8b5cf6" />
                <Text className="block text-sm text-violet-600 ml-1">添加条件</Text>
              </Button>
            </View>
            <View className="flex-1">
              <Button className="w-full" onClick={saveValueConditions}>
                {valueSaved ? <Check size={14} color="#fff" /> : <Star size={14} color="#fff" />}
                <Text className="block text-sm text-white ml-1">{valueSaved ? "已保存" : "保存"}</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // 微恐惧挑战
  if (activeTool === "fear-challenge") {
    const CHALLENGES = [
      { title: "主动和一个陌生人打招呼", coins: 3 },
      { title: "在餐厅主动点一道没吃过的菜", coins: 2 },
      { title: "在群里发一条自己的观点", coins: 3 },
      { title: "向一个人表达感谢", coins: 2 },
      { title: "拒绝一个让你不舒服的请求", coins: 5 },
      { title: "穿一件你一直想穿但不敢的衣服", coins: 3 },
      { title: "主动约一个朋友出来", coins: 3 },
      { title: "在社交媒体分享一段真实的感受", coins: 4 },
    ]
    const todayChallenge = CHALLENGES[new Date().getDate() % CHALLENGES.length]

    return (
      <View className="min-h-full bg-gray-50 pb-20">
        <View className="px-4 pt-4">
          <View className="flex flex-row items-center gap-2 mb-4" onClick={() => setActiveTool("home")}>
            <ArrowLeft size={20} color="#10b981" />
            <Text className="block text-emerald-500 text-sm">返回工具箱</Text>
          </View>

          <Text className="block text-lg font-semibold text-gray-800 mb-1">微恐惧挑战</Text>
          <Text className="block text-sm text-gray-500 mb-4">
            走出舒适区一小步，配得感提升一大步
          </Text>

          <Card className="border-0 shadow-sm mb-4">
            <CardContent className="p-4">
              <View className="flex flex-row items-center justify-between mb-3">
                <Badge variant="secondary">
                  <Text className="block text-xs">今日挑战</Text>
                </Badge>
                <View className="flex flex-row items-center gap-1">
                  <Zap size={14} color="#f59e0b" />
                  <Text className="block text-amber-600 text-xs font-semibold">+{todayChallenge.coins} 成功币</Text>
                </View>
              </View>

              <Text className="block text-base font-semibold text-gray-800 mb-3">
                {todayChallenge.title}
              </Text>

              {!challengeAccepted ? (
                <Button className="w-full" onClick={() => setChallengeAccepted(true)}>
                  <Shield size={14} color="#fff" />
                  <Text className="block text-sm text-white ml-1">接受挑战</Text>
                </Button>
              ) : (
                <View className="flex flex-col gap-2">
                  <View className="bg-emerald-50 rounded-xl p-3">
                    <Text className="block text-emerald-700 text-sm text-center">
                      太棒了！你接受了今天的挑战！
                    </Text>
                  </View>
                  <Button className="w-full" onClick={async () => {
                    try {
                      await Network.request({
                        url: "/api/deposits",
                        method: "POST",
                        data: {
                          content: "完成微恐惧挑战：" + todayChallenge.title,
                          emotion: "突破",
                          difficulty: "medium",
                          coins: todayChallenge.coins,
                          type: "challenge",
                        },
                      })
                      Taro.switchTab({ url: "/pages/index/index" })
                    } catch (err) {
                      console.log("Challenge complete error:", err)
                    }
                  }}
                  >
                    <Check size={14} color="#fff" />
                    <Text className="block text-sm text-white ml-1">我完成了!</Text>
                  </Button>
                </View>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">什么是微恐惧挑战？</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Text className="block text-xs text-gray-500 leading-relaxed">
                微恐惧挑战基于暴露疗法的原理，通过循序渐进地面对小恐惧，帮助你建立我能做到的信心。每次完成挑战，你的配得感就会增强一分。关键不是挑战有多难，而是你愿意迈出那一步。
              </Text>
            </CardContent>
          </Card>
        </View>
      </View>
    )
  }

  return null
}
