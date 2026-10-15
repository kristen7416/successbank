import { View, Text } from "@tarojs/components"
import { useState } from "react"
import Taro from "@tarojs/taro"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Network } from "@/network"
import { notifyDataUpdated } from "@/services/local-storage-backend"
import { Heart, Sun, Shield, Coffee, Hand, Check, Coins, Sparkles } from "lucide-react-taro"

const PRESET_TAGS = [
  { label: "按时起床", icon: Sun, color: "bg-yellow-100 border-2 border-yellow-300 text-yellow-700", iconColor: "#ca8a04" },
  { label: "主动打招呼", icon: Hand, color: "bg-teal-100 border-2 border-teal-300 text-teal-700", iconColor: "#0d9488" },
  { label: "拒绝不合理请求", icon: Shield, color: "bg-purple-100 border-2 border-purple-300 text-purple-700", iconColor: "#9333ea" },
  { label: "完成任务", icon: Check, color: "bg-emerald-100 border-2 border-emerald-300 text-emerald-700", iconColor: "#059669" },
  { label: "照顾好自己", icon: Coffee, color: "bg-orange-100 border-2 border-orange-300 text-orange-700", iconColor: "#ea580c" },
  { label: "帮助他人", icon: Heart, color: "bg-pink-100 border-2 border-pink-300 text-pink-700", iconColor: "#db2777" },
]

const EMOTIONS = [
  { label: "开心", emoji: "😄", color: "bg-yellow-100 border-2 border-yellow-300 text-yellow-700" },
  { label: "自豪", emoji: "😤", color: "bg-teal-100 border-2 border-teal-300 text-teal-700" },
  { label: "轻松", emoji: "😌", color: "bg-emerald-100 border-2 border-emerald-300 text-emerald-700" },
  { label: "突破", emoji: "💥", color: "bg-purple-100 border-2 border-purple-300 text-purple-700" },
  { label: "平静", emoji: "🧘", color: "bg-stone-100 border-2 border-stone-300 text-stone-700" },
  { label: "释然", emoji: "🕊️", color: "bg-pink-100 border-2 border-pink-300 text-pink-700" },
]

const DIFFICULTIES = [
  { label: "简单", value: "easy", coins: 1, color: "border-emerald-300 bg-emerald-50", activeColor: "border-emerald-400 bg-emerald-100", textColor: "text-emerald-600" },
  { label: "中等", value: "medium", coins: 3, color: "border-yellow-300 bg-yellow-50", activeColor: "border-yellow-400 bg-yellow-100", textColor: "text-yellow-600" },
  { label: "困难", value: "hard", coins: 5, color: "border-orange-300 bg-orange-50", activeColor: "border-orange-400 bg-orange-100", textColor: "text-orange-600" },
]

export default function DepositPage() {
  const [step, setStep] = useState<"select" | "detail">("select")
  const [selectedTag, setSelectedTag] = useState("")
  const [customContent, setCustomContent] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const depositContent = selectedTag || customContent
  const currentCoins = DIFFICULTIES.find(d => d.value === selectedDifficulty)?.coins || 1

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
    setCustomContent("")
    setStep("detail")
  }

  const handleCustomInput = () => {
    setSelectedTag("")
    setStep("detail")
  }

  const handleSubmit = async () => {
    if (!depositContent.trim()) return

    setSubmitting(true)
    try {
      const res = await Network.request({
        url: "/api/deposits",
        method: "POST",
        data: {
          content: depositContent.trim(),
          emotion: selectedEmotion,
          difficulty: selectedDifficulty,
          coins: currentCoins,
          note: note.trim(),
          type: selectedTag ? "preset" : "custom",
        },
      })
      console.log("Deposit response:", res.data)
      notifyDataUpdated()

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        resetForm()
        notifyDataUpdated()
        Taro.switchTab({ url: "/pages/index/index" })
      }, 1500)
    } catch (err) {
      console.log("Deposit error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep("select")
    setSelectedTag("")
    setCustomContent("")
    setSelectedEmotion("")
    setSelectedDifficulty("easy")
    setNote("")
  }

  // 成功动画 - 游戏风金币奖励
  if (showSuccess) {
    return (
      <View className="min-h-full bg-gradient-to-b from-teal-400 to-teal-500 flex flex-col items-center justify-center">
        <View className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-300 flex items-center justify-center mb-4">
          <Coins size={48} color="#ca8a04" />
        </View>
        <Text className="block text-2xl font-black text-white mb-2">存款成功!</Text>
        <View className="rounded-full bg-yellow-300 px-4 py-2 mb-2">
          <Text className="block text-yellow-900 font-black text-lg">+{currentCoins} 成功币</Text>
        </View>
        <Text className="block text-teal-100 text-sm font-bold">每一次成功都值得被记住</Text>
      </View>
    )
  }

  // 选择存款类型
  if (step === "select") {
    return (
      <View className="min-h-full bg-amber-50 pb-20">
        <View className="bg-gradient-to-b from-teal-400 to-teal-500 px-4 pt-4 pb-6 rounded-b-[2rem]">
          <Text className="block text-xl font-black text-white mb-1">存入你的成功</Text>
          <Text className="block text-sm text-teal-100 font-bold">选择一个预设标签，或者自定义记录</Text>
        </View>

        <View className="px-4 -mt-4">
          {/* 预设标签 */}
          <Card className="border-2 border-amber-200 shadow-md mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">快速存款</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <View className="flex flex-row flex-wrap gap-2">
                {PRESET_TAGS.map((tag) => (
                  <View
                    key={tag.label}
                    className={`${tag.color} rounded-xl px-3 py-2 flex flex-row items-center gap-1.5`}
                    onClick={() => handleTagSelect(tag.label)}
                  >
                    <tag.icon size={14} color={tag.iconColor} />
                    <Text className="block text-xs font-bold">{tag.label}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* 自定义输入 */}
          <Card className="border-2 border-amber-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">自定义存款</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <View className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 mb-3">
                <Input
                  className="w-full bg-transparent"
                  placeholder="写下你今天做成功的一件事..."
                  value={customContent}
                  onInput={(e) => setCustomContent(e.detail.value)}
                />
              </View>
              <Button
                className="w-full bg-teal-400 border-2 border-teal-500 rounded-xl font-bold"
                disabled={!customContent.trim()}
                onClick={handleCustomInput}
              >
                <Text className="block text-sm text-white">继续</Text>
              </Button>
            </CardContent>
          </Card>

          {/* 提示语 */}
          <View className="mt-4 mb-4">
            <Card className="border-2 border-yellow-300 bg-gradient-to-b from-yellow-50 to-amber-50 shadow-md">
              <CardContent className="p-3">
                <View className="flex flex-row items-center gap-2">
                  <Sparkles size={16} color="#ca8a04" />
                  <Text className="block text-yellow-700 text-xs font-bold">
                    再小的成功都值得被记录。按时起床、主动微笑、完成一件事...都是你的成功存款。
                  </Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>
    )
  }

  // 填写详情
  return (
    <View className="min-h-full bg-amber-50 pb-20">
      <View className="bg-gradient-to-b from-teal-400 to-teal-500 px-4 pt-4 pb-6 rounded-b-[2rem]">
        <View className="flex flex-row items-center justify-between">
          <Text className="block text-lg font-black text-white">填写详情</Text>
          <View className="rounded-full bg-white bg-opacity-20 px-3 py-1" onClick={resetForm}>
            <Text className="block text-white text-xs font-bold">重新选择</Text>
          </View>
        </View>
      </View>

      <View className="px-4 -mt-4">
        {/* 存款内容 */}
        <Card className="border-2 border-amber-200 shadow-md mb-4">
          <CardContent className="p-4">
            <Text className="block text-xs text-stone-400 font-bold mb-2">存款内容</Text>
            {selectedTag ? (
              <View className="rounded-xl bg-teal-100 border-2 border-teal-300 px-3 py-2 inline-block">
                <Text className="block text-teal-700 font-bold">{selectedTag}</Text>
              </View>
            ) : (
              <Text className="block text-stone-700 text-sm font-medium">{customContent}</Text>
            )}
          </CardContent>
        </Card>

        {/* 选择情绪 */}
        <Card className="border-2 border-amber-200 shadow-md mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">感受如何？</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <View className="flex flex-row flex-wrap gap-2">
              {EMOTIONS.map((emo) => (
                <View
                  key={emo.label}
                  className={`rounded-xl px-3 py-2 border-2 ${
                    selectedEmotion === emo.label
                      ? "bg-teal-400 border-teal-500"
                      : emo.color
                  }`}
                  onClick={() => setSelectedEmotion(emo.label)}
                >
                  <Text className={`block text-xs font-bold ${
                    selectedEmotion === emo.label ? "text-white" : ""
                  }`}
                  >{emo.emoji} {emo.label}</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 难度选择 */}
        <Card className="border-2 border-amber-200 shadow-md mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">难度评估</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <View className="flex flex-row gap-2">
              {DIFFICULTIES.map((diff) => (
                <View
                  key={diff.value}
                  className={`flex-1 rounded-xl p-3 border-3 text-center ${
                    selectedDifficulty === diff.value
                      ? diff.activeColor + " border-2"
                      : diff.color + " border-2"
                  }`}
                  onClick={() => setSelectedDifficulty(diff.value)}
                >
                  <Text className={`block text-sm font-black ${
                    selectedDifficulty === diff.value ? diff.textColor : "text-stone-600"
                  }`}
                  >{diff.label}</Text>
                  <View className="flex flex-row items-center justify-center gap-1 mt-1">
                    <Coins size={10} color={selectedDifficulty === diff.value ? "#ca8a04" : "#a8a29e"} />
                    <Text className={`block text-xs font-bold ${
                      selectedDifficulty === diff.value ? "text-yellow-600" : "text-stone-400"
                    }`}
                    >+{diff.coins}</Text>
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 备注 */}
        <Card className="border-2 border-amber-200 shadow-md mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">补充说明（选填）</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <View className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3">
              <Textarea
                style={{ width: "100%", minHeight: "80px", backgroundColor: "transparent" }}
                placeholder="记录更多细节或感受..."
                maxlength={200}
                value={note}
                onInput={(e) => setNote(e.detail.value)}
              />
            </View>
          </CardContent>
        </Card>

        {/* 提交 - 游戏风金币面板 */}
        <View className="mb-4">
          <Card className="border-2 border-yellow-300 bg-gradient-to-b from-yellow-50 to-amber-50 shadow-md">
            <CardContent className="p-4">
              <View className="flex flex-row items-center justify-between mb-3">
                <Text className="block text-sm text-stone-600 font-bold">本次存款</Text>
                <View className="flex flex-row items-center gap-1">
                  <Coins size={18} color="#ca8a04" />
                  <Text className="block text-teal-500 text-xl font-black">+{currentCoins} 成功币</Text>
                </View>
              </View>
              <Button
                className="w-full bg-teal-400 border-2 border-teal-500 rounded-xl font-bold"
                disabled={submitting}
                onClick={handleSubmit}
              >
                <Text className="block text-sm text-white">
                  {submitting ? "存入中..." : "确认存入"}
                </Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </View>
    </View>
  )
}
