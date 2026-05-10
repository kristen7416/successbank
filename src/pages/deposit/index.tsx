import { View, Text } from "@tarojs/components"
import { useState } from "react"
import Taro from "@tarojs/taro"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Network } from "@/network"
import { Star, Heart, Sun, Shield, Coffee, Hand, Check } from "lucide-react-taro"

// 预设成功标签
const PRESET_TAGS = [
  { label: "按时起床", icon: Sun, color: "bg-amber-100 text-amber-700", iconColor: "#b45309" },
  { label: "主动打招呼", icon: Hand, color: "bg-sky-100 text-sky-700", iconColor: "#0369a1" },
  { label: "拒绝不合理请求", icon: Shield, color: "bg-violet-100 text-violet-700", iconColor: "#6d28d9" },
  { label: "完成任务", icon: Check, color: "bg-emerald-100 text-emerald-700", iconColor: "#047857" },
  { label: "照顾好自己", icon: Coffee, color: "bg-orange-100 text-orange-700", iconColor: "#c2410c" },
  { label: "帮助他人", icon: Heart, color: "bg-rose-100 text-rose-700", iconColor: "#be123c" },
]

// 情绪标签
const EMOTIONS = [
  { label: "开心", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { label: "自豪", color: "bg-sky-100 text-sky-700 border-sky-300" },
  { label: "轻松", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { label: "突破", color: "bg-violet-100 text-violet-700 border-violet-300" },
  { label: "平静", color: "bg-gray-100 text-gray-700 border-gray-300" },
  { label: "释然", color: "bg-rose-100 text-rose-700 border-rose-300" },
]

// 难度选项
const DIFFICULTIES = [
  { label: "简单", value: "easy", coins: 1 },
  { label: "中等", value: "medium", coins: 3 },
  { label: "困难", value: "hard", coins: 5 },
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

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        resetForm()
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

  // 成功动画
  if (showSuccess) {
    return (
      <View className="min-h-full bg-gray-50 flex flex-col items-center justify-center">
        <View className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-4">
          <Star size={40} color="#0ea5e9" />
        </View>
        <Text className="block text-xl font-bold text-sky-600 mb-2">存款成功!</Text>
        <Text className="block text-gray-500 text-sm">+{currentCoins} 成功币已入账</Text>
        <Text className="block text-amber-500 text-sm mt-1">每一次成功都值得被记住</Text>
      </View>
    )
  }

  // 选择存款类型
  if (step === "select") {
    return (
      <View className="min-h-full bg-gray-50 pb-20">
        <View className="px-4 pt-4">
          <Text className="block text-lg font-semibold text-gray-800 mb-1">存入你的成功</Text>
          <Text className="block text-sm text-gray-500 mb-4">选择一个预设标签，或者自定义记录</Text>

          {/* 预设标签 */}
          <Card className="border-0 shadow-sm mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">快速存款</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <View className="flex flex-row flex-wrap gap-2">
                {PRESET_TAGS.map((tag) => (
                  <View
                    key={tag.label}
                    className={`${tag.color} rounded-full px-3 py-2 flex flex-row items-center gap-1`}
                    onClick={() => handleTagSelect(tag.label)}
                  >
                    <tag.icon size={14} color={tag.iconColor} />
                    <Text className="block text-xs font-medium">{tag.label}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* 自定义输入 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">自定义存款</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <View className="bg-gray-50 rounded-xl p-3 mb-3">
                <Input
                  className="w-full bg-transparent"
                  placeholder="写下你今天做成功的一件事..."
                  value={customContent}
                  onInput={(e) => setCustomContent(e.detail.value)}
                />
              </View>
              <Button
                className="w-full"
                disabled={!customContent.trim()}
                onClick={handleCustomInput}
              >
                <Text className="block text-sm text-white">继续</Text>
              </Button>
            </CardContent>
          </Card>

          {/* 提示语 */}
          <View className="mt-4 mb-4">
            <Card className="border-0 shadow-sm bg-amber-50">
              <CardContent className="p-3">
                <Text className="block text-amber-700 text-xs text-center">
                  再小的成功都值得被记录。按时起床、主动微笑、完成一件事...都是你的成功存款。
                </Text>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>
    )
  }

  // 填写详情
  return (
    <View className="min-h-full bg-gray-50 pb-20">
      <View className="px-4 pt-4">
        {/* 存款内容 */}
        <Card className="border-0 shadow-sm mb-4">
          <CardHeader className="pb-2">
            <View className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">存款内容</CardTitle>
              <View onClick={resetForm}>
                <Text className="block text-sky-500 text-xs">重新选择</Text>
              </View>
            </View>
          </CardHeader>
          <CardContent className="pt-0">
            {selectedTag ? (
              <Badge variant="secondary" className="text-sm">
                <Text className="block">{selectedTag}</Text>
              </Badge>
            ) : (
              <Text className="block text-gray-700 text-sm">{customContent}</Text>
            )}
          </CardContent>
        </Card>

        {/* 选择情绪 */}
        <Card className="border-0 shadow-sm mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">感受如何？</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <View className="flex flex-row flex-wrap gap-2">
              {EMOTIONS.map((emo) => (
                <View
                  key={emo.label}
                  className={`rounded-full px-3 py-2 border ${
                    selectedEmotion === emo.label
                      ? "bg-sky-500 border-sky-500"
                      : emo.color
                  }`}
                  onClick={() => setSelectedEmotion(emo.label)}
                >
                  <Text className={`block text-xs font-medium ${
                    selectedEmotion === emo.label ? "text-white" : ""
                  }`}
                  >{emo.label}</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 难度选择 */}
        <Card className="border-0 shadow-sm mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">难度评估</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <View className="flex flex-row gap-2">
              {DIFFICULTIES.map((diff) => (
                <View
                  key={diff.value}
                  className={`flex-1 rounded-xl p-3 border-2 text-center ${
                    selectedDifficulty === diff.value
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-100 bg-white"
                  }`}
                  onClick={() => setSelectedDifficulty(diff.value)}
                >
                  <Text className={`block text-sm font-semibold ${
                    selectedDifficulty === diff.value ? "text-sky-600" : "text-gray-600"
                  }`}
                  >{diff.label}</Text>
                  <Text className={`block text-xs mt-1 ${
                    selectedDifficulty === diff.value ? "text-sky-500" : "text-gray-400"
                  }`}
                  >+{diff.coins} 成功币</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 备注 */}
        <Card className="border-0 shadow-sm mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">补充说明（选填）</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <View className="bg-gray-50 rounded-xl p-3">
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

        {/* 提交 */}
        <View className="mb-4">
          <Card className="border-0 shadow-sm bg-sky-50">
            <CardContent className="p-4">
              <View className="flex flex-row items-center justify-between mb-3">
                <Text className="block text-sm text-gray-600">本次存款</Text>
                <View className="flex flex-row items-center gap-1">
                  <Star size={16} color="#0ea5e9" />
                  <Text className="block text-sky-600 text-lg font-bold">+{currentCoins} 成功币</Text>
                </View>
              </View>
              <Button
                className="w-full"
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
