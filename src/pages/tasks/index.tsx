import { View, Text } from "@tarojs/components"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Network } from "@/network"
import { Lock, Check } from "lucide-react-taro"

// 21天任务数据
const TASKS_21 = [
  { day: 1, title: "对自己说我值得", desc: "站在镜子前，看着自己的眼睛，认真地说三遍：我值得所有美好。", category: "self-affirmation" },
  { day: 2, title: "写下3个优点", desc: "拿出纸笔，认真写下你身上的3个优点。不需要很伟大，我善良、我努力都算。", category: "self-discovery" },
  { day: 3, title: "接受一次赞美", desc: "当别人夸你时，不要急着否定或谦虚，试着微笑说谢谢。", category: "acceptance" },
  { day: 4, title: "为自己做一件事", desc: "做一件纯粹为自己开心的事：买喜欢的零食、看一部想看的电影、泡个热水澡。", category: "self-care" },
  { day: 5, title: "拒绝一个不合理请求", desc: "练习说不。哪怕是很小的拒绝，比如拒绝一次不必要的加班。", category: "boundary" },
  { day: 6, title: "感恩练习", desc: "写下今天3件值得感恩的小事，可以是一杯好喝的咖啡、一个微笑。", category: "gratitude" },
  { day: 7, title: "阶段复盘：第一周", desc: "回顾这一周的变化，写下你的感受。你是否开始更关注自己的需求了？", category: "review" },
  { day: 8, title: "对着镜子微笑", desc: "早晨起床后，对着镜子里的自己微笑。注意，是发自内心的那种。", category: "self-affirmation" },
  { day: 9, title: "允许自己犯错", desc: "今天，当你犯错时，不要自责，试着对自己说没关系，我在学习。", category: "self-compassion" },
  { day: 10, title: "做一件害怕的小事", desc: "迈出舒适区：主动发言、尝试新食物、和不熟悉的人聊天。", category: "courage" },
  { day: 11, title: "停止自我比较", desc: "当你发现自己在和他人比较时，提醒自己：每个人都有自己的时区。", category: "acceptance" },
  { day: 12, title: "犒劳自己", desc: "给自己一个小奖励。不是因为你做了什么了不起的事，而是因为你值得。", category: "self-care" },
  { day: 13, title: "写一封给自己的情书", desc: "用最温柔的语言，给自己写一封信。就像写给最亲密的朋友。", category: "self-love" },
  { day: 14, title: "阶段复盘：第二周", desc: "回顾两周的变化，你是否开始更善待自己了？为自己鼓掌。", category: "review" },
  { day: 15, title: "记录一次我做到了", desc: "今天完成一件事后，无论大小，对自己说我做到了并认真记录。", category: "achievement" },
  { day: 16, title: "设定一个小边界", desc: "明确告诉某人你的底线。比如我需要一些独处时间或这个话题我不想聊。", category: "boundary" },
  { day: 17, title: "承认一个脆弱", desc: "允许自己在信任的人面前展示脆弱。承认我需要帮助也是一种力量。", category: "vulnerability" },
  { day: 18, title: "做5分钟正念冥想", desc: "找一个安静的地方，闭眼5分钟，专注于呼吸。不需要完美，走神也没关系。", category: "mindfulness" },
  { day: 19, title: "删除一条自我批评", desc: "当你听到内心的批评声音时，有意识地把它转化为建设性的话。", category: "self-compassion" },
  { day: 20, title: "为自己的成长庆祝", desc: "回顾21天旅程，列出你所有的进步。每一个都值得庆祝。", category: "celebration" },
  { day: 21, title: "给未来的自己一封信", desc: "写给3个月后的自己，告诉TA你已经变得更勇敢、更值得了。", category: "self-love" },
]

const CATEGORY_COLORS: Record<string, string> = {
  "self-affirmation": "bg-sky-100 text-sky-700",
  "self-discovery": "bg-violet-100 text-violet-700",
  "acceptance": "bg-emerald-100 text-emerald-700",
  "self-care": "bg-amber-100 text-amber-700",
  "boundary": "bg-rose-100 text-rose-700",
  "gratitude": "bg-orange-100 text-orange-700",
  "review": "bg-sky-100 text-sky-700",
  "self-compassion": "bg-emerald-100 text-emerald-700",
  "courage": "bg-violet-100 text-violet-700",
  "self-love": "bg-rose-100 text-rose-700",
  "achievement": "bg-amber-100 text-amber-700",
  "vulnerability": "bg-orange-100 text-orange-700",
  "mindfulness": "bg-emerald-100 text-emerald-700",
  "celebration": "bg-amber-100 text-amber-700",
}

const CATEGORY_LABELS: Record<string, string> = {
  "self-affirmation": "自我肯定",
  "self-discovery": "自我发现",
  "acceptance": "接纳",
  "self-care": "自我关怀",
  "boundary": "边界",
  "gratitude": "感恩",
  "review": "复盘",
  "self-compassion": "自我慈悲",
  "courage": "勇气",
  "self-love": "爱自己",
  "achievement": "成就",
  "vulnerability": "脆弱",
  "mindfulness": "正念",
  "celebration": "庆祝",
}

export default function TasksPage() {
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetchTaskData()
  }, [])

  const fetchTaskData = async () => {
    try {
      const res = await Network.request({ url: "/api/tasks/progress" })
      console.log("Tasks progress response:", res.data)
      if (res.data?.data) {
        const data = res.data.data
        setCompletedDays(data.completed_days || [])
        setCurrentDay(data.current_day || 1)
      }
    } catch (err) {
      console.log("Fetch task data error:", err)
      setCurrentDay(1)
    }
  }

  const handleCompleteTask = async (day: number) => {
    setCompleting(true)
    try {
      const res = await Network.request({
        url: "/api/tasks/complete",
        method: "POST",
        data: { day },
      })
      console.log("Complete task response:", res.data)
      setCompletedDays([...completedDays, day])
      if (day === currentDay && currentDay < 21) {
        setCurrentDay(currentDay + 1)
      }
    } catch (err) {
      console.log("Complete task error:", err)
      setCompletedDays([...completedDays, day])
    } finally {
      setCompleting(false)
    }
  }

  const progressPercent = (completedDays.length / 21) * 100

  return (
    <View className="min-h-full bg-gray-50 pb-20">
      {/* 顶部进度区 */}
      <View className="bg-sky-500 px-4 pt-4 pb-6 rounded-b-3xl">
        <View className="flex flex-row items-center justify-between mb-3">
          <View>
            <Text className="block text-white text-lg font-bold">21天配得感计划</Text>
            <Text className="block text-sky-100 text-xs mt-1">每天一个小行动，重新认识我值得</Text>
          </View>
          <View className="bg-white bg-opacity-20 rounded-full px-3 py-1">
            <Text className="block text-white text-xs font-semibold">Day {currentDay}/21</Text>
          </View>
        </View>
        <Progress value={progressPercent} className="h-2" />
        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="block text-sky-100 text-xs">已完成 {completedDays.length} 天</Text>
          <Text className="block text-sky-100 text-xs">{Math.round(progressPercent)}%</Text>
        </View>
      </View>

      {/* 今日任务 */}
      <View className="px-4 -mt-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            {(() => {
              const task = TASKS_21[currentDay - 1]
              if (!task) return null
              const isCompleted = completedDays.includes(currentDay)
              return (
                <View>
                  <View className="flex flex-row items-center justify-between mb-2">
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      <Text className="block text-xs">今日任务 · Day {currentDay}</Text>
                    </Badge>
                    {isCompleted && (
                      <View className="flex flex-row items-center gap-1">
                        <Check size={14} color="#10b981" />
                        <Text className="block text-emerald-600 text-xs">已完成</Text>
                      </View>
                    )}
                  </View>
                  <Text className="block text-base font-semibold text-gray-800 mb-2">{task.title}</Text>
                  <Text className="block text-sm text-gray-500 leading-relaxed mb-3">{task.desc}</Text>
                  <View className="flex flex-row items-center justify-between">
                    <Badge className={CATEGORY_COLORS[task.category] || "bg-gray-100 text-gray-700"}>
                      <Text className="block text-xs">{CATEGORY_LABELS[task.category] || task.category}</Text>
                    </Badge>
                    {!isCompleted && (
                      <Button size="sm" disabled={completing} onClick={() => handleCompleteTask(currentDay)}>
                        <Text className="block text-sm text-white">
                          {completing ? "打卡中..." : "完成打卡"}
                        </Text>
                      </Button>
                    )}
                  </View>
                </View>
              )
            })()}
          </CardContent>
        </Card>
      </View>

      {/* 全部任务列表 */}
      <View className="px-4 mt-4">
        <Text className="block text-base font-semibold text-gray-800 mb-3">全部任务</Text>
        <View className="flex flex-col gap-2">
          {TASKS_21.map((task) => {
            const isCompleted = completedDays.includes(task.day)
            const isCurrent = task.day === currentDay
            const isLocked = task.day > currentDay
            const isExpanded = expandedDay === task.day

            return (
              <Card
                key={task.day}
                className={`border-0 shadow-sm ${
                  isCurrent ? "border-l-4 border-l-sky-500" : ""
                } ${isLocked ? "opacity-60" : ""}`}
                onClick={() => !isLocked && setExpandedDay(isExpanded ? null : task.day)}
              >
                <CardContent className="p-3">
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2 flex-1">
                      {isCompleted ? (
                        <View className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check size={12} color="#10b981" />
                        </View>
                      ) : isLocked ? (
                        <View className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <Lock size={12} color="#9ca3af" />
                        </View>
                      ) : (
                        <View className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center">
                          <Text className="block text-sky-600 text-xs font-bold">{task.day}</Text>
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className={`block text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}>
                          Day {task.day}: {task.title}
                        </Text>
                      </View>
                      <Badge className={CATEGORY_COLORS[task.category] || "bg-gray-100 text-gray-700"}>
                        <Text className="block text-xs">{CATEGORY_LABELS[task.category] || ""}</Text>
                      </Badge>
                    </View>
                  </View>
                  {isExpanded && (
                    <View className="mt-2 ml-8">
                      <Text className="block text-xs text-gray-500 leading-relaxed">{task.desc}</Text>
                      {!isCompleted && !isLocked && (
                        <Button size="sm" className="mt-2" onClick={(e) => {
                          e.stopPropagation()
                          handleCompleteTask(task.day)
                        }}
                        >
                          <Text className="block text-xs text-white">完成打卡</Text>
                        </Button>
                      )}
                    </View>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </View>
      </View>

      {/* 底部鼓励 */}
      <View className="px-4 mt-4 mb-4">
        <Card className="border-0 shadow-sm bg-amber-50">
          <CardContent className="p-3">
            <Text className="block text-amber-700 text-xs text-center">
              完成21天计划，你将获得配得感大师勋章和100成功币奖励！
            </Text>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
