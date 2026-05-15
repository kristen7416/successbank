import { View, Text } from "@tarojs/components"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Network } from "@/network"
import { Lock, Check, Trophy, Zap } from "lucide-react-taro"

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

const CATEGORY_STYLES: Record<string, { color: string; label: string }> = {
  "self-affirmation": { color: "bg-teal-100 border-2 border-teal-300 text-teal-700", label: "自我肯定" },
  "self-discovery": { color: "bg-purple-100 border-2 border-purple-300 text-purple-700", label: "自我发现" },
  "acceptance": { color: "bg-emerald-100 border-2 border-emerald-300 text-emerald-700", label: "接纳" },
  "self-care": { color: "bg-yellow-100 border-2 border-yellow-300 text-yellow-700", label: "自我关怀" },
  "boundary": { color: "bg-pink-100 border-2 border-pink-300 text-pink-700", label: "边界" },
  "gratitude": { color: "bg-orange-100 border-2 border-orange-300 text-orange-700", label: "感恩" },
  "review": { color: "bg-teal-100 border-2 border-teal-300 text-teal-700", label: "复盘" },
  "self-compassion": { color: "bg-emerald-100 border-2 border-emerald-300 text-emerald-700", label: "自我慈悲" },
  "courage": { color: "bg-purple-100 border-2 border-purple-300 text-purple-700", label: "勇气" },
  "self-love": { color: "bg-pink-100 border-2 border-pink-300 text-pink-700", label: "爱自己" },
  "achievement": { color: "bg-yellow-100 border-2 border-yellow-300 text-yellow-700", label: "成就" },
  "vulnerability": { color: "bg-orange-100 border-2 border-orange-300 text-orange-700", label: "脆弱" },
  "mindfulness": { color: "bg-emerald-100 border-2 border-emerald-300 text-emerald-700", label: "正念" },
  "celebration": { color: "bg-yellow-100 border-2 border-yellow-300 text-yellow-700", label: "庆祝" },
}

export default function TasksPage() {
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [todayCompleted, setTodayCompleted] = useState(false)
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
        setTodayCompleted(data.today_completed || false)
      }
    } catch (err) {
      console.log("Fetch task data error:", err)
      setCurrentDay(1)
    }
  }

  const handleCompleteTask = async (day: number) => {
    if (todayCompleted) return
    setCompleting(true)
    try {
      const res = await Network.request({
        url: "/api/tasks/complete",
        method: "POST",
        data: { day },
      })
      console.log("Complete task response:", res.data)
      const result = res.data?.data
      if (result?.already_completed_today) {
        setTodayCompleted(true)
      } else if (!result?.already_completed) {
        setCompletedDays([...completedDays, day])
        setTodayCompleted(true)
        if (day === currentDay && currentDay < 21) {
          setCurrentDay(currentDay + 1)
        }
      }
    } catch (err) {
      console.log("Complete task error:", err)
    } finally {
      setCompleting(false)
    }
  }

  const progressPercent = (completedDays.length / 21) * 100

  return (
    <View className="min-h-full bg-amber-50 pb-20">
      {/* 顶部进度区 - 游戏任务面板 */}
      <View className="bg-gradient-to-b from-teal-400 to-teal-500 px-4 pt-4 pb-8 rounded-b-[2rem]">
        <View className="flex flex-row items-center justify-between mb-3">
          <View>
            <Text className="block text-white text-lg font-black">21天配得感计划</Text>
            <Text className="block text-teal-100 text-xs font-bold mt-1">每天一个小行动，重新认识我值得</Text>
          </View>
          <View className="rounded-full border-2 border-yellow-300 bg-yellow-100 px-3 py-1">
            <Text className="block text-yellow-700 text-xs font-black">Day {currentDay}/21</Text>
          </View>
        </View>
        <Progress value={progressPercent} className="h-3" />
        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="block text-teal-100 text-xs font-bold">已完成 {completedDays.length} 天</Text>
          <Text className="block text-teal-100 text-xs font-bold">{Math.round(progressPercent)}%</Text>
        </View>
      </View>

      {/* 今日任务 */}
      <View className="px-4 -mt-4">
        <Card className="border-2 border-yellow-300 bg-gradient-to-b from-white to-amber-50 shadow-lg">
          <CardContent className="p-4">
            {(() => {
              const task = TASKS_21[currentDay - 1]
              if (!task) return null
              const isCompleted = completedDays.includes(currentDay)
              const catStyle = CATEGORY_STYLES[task.category] || { color: "bg-stone-100 border-2 border-stone-300 text-stone-700", label: task.category }
              return (
                <View>
                  <View className="flex flex-row items-center justify-between mb-2">
                    <Badge className={`${catStyle.color} font-bold`}>
                      <Text className="block text-xs font-bold">今日任务 · Day {currentDay}</Text>
                    </Badge>
                    {todayCompleted && (
                      <View className="flex flex-row items-center gap-1">
                        <View className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                          <Check size={10} color="#fff" />
                        </View>
                        <Text className="block text-emerald-600 text-xs font-bold">今日已打卡</Text>
                      </View>
                    )}
                  </View>
                  <Text className="block text-base font-black text-stone-800 mb-2">{task.title}</Text>
                  <Text className="block text-sm text-stone-500 leading-relaxed mb-3">{task.desc}</Text>
                  <View className="flex flex-row items-center justify-between">
                    <Badge className={catStyle.color}>
                      <Text className="block text-xs font-bold">{catStyle.label}</Text>
                    </Badge>
                    {!todayCompleted && !isCompleted && (
                      <Button size="sm" className="bg-teal-400 border-2 border-teal-500 rounded-xl font-bold" disabled={completing} onClick={() => handleCompleteTask(currentDay)}>
                        <Text className="block text-sm text-white">
                          {completing ? "打卡中..." : "完成打卡"}
                        </Text>
                      </Button>
                    )}
                    {todayCompleted && !isCompleted && (
                      <View className="bg-stone-100 border-2 border-stone-200 rounded-xl px-3 py-1">
                        <Text className="block text-stone-400 text-xs font-bold">明天继续</Text>
                      </View>
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
        <Text className="block text-base font-black text-stone-800 mb-3">全部任务</Text>
        <View className="flex flex-col gap-2">
          {TASKS_21.map((task) => {
            const isCompleted = completedDays.includes(task.day)
            const isCurrent = task.day === currentDay
            const isLocked = task.day > currentDay
            const isExpanded = expandedDay === task.day
            const catStyle = CATEGORY_STYLES[task.category] || { color: "bg-stone-100 border-2 border-stone-300 text-stone-700", label: "" }

            return (
              <Card
                key={task.day}
                className={`border-2 shadow-sm ${
                  isCurrent ? "border-teal-300 bg-gradient-to-b from-teal-50 to-white" :
                  isCompleted ? "border-emerald-200 bg-emerald-50" :
                  isLocked ? "border-stone-200 bg-stone-50 opacity-50" :
                  "border-amber-200 bg-white"
                }`}
                onClick={() => !isLocked && setExpandedDay(isExpanded ? null : task.day)}
              >
                <CardContent className="p-3">
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2 flex-1">
                      {isCompleted ? (
                        <View className="w-7 h-7 rounded-lg bg-emerald-400 flex items-center justify-center">
                          <Check size={14} color="#fff" />
                        </View>
                      ) : isLocked ? (
                        <View className="w-7 h-7 rounded-lg bg-stone-200 flex items-center justify-center">
                          <Lock size={12} color="#78716c" />
                        </View>
                      ) : (
                        <View className="w-7 h-7 rounded-lg bg-teal-100 border-2 border-teal-300 flex items-center justify-center">
                          <Text className="block text-teal-600 text-xs font-black">{task.day}</Text>
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className={`block text-sm font-bold ${isCompleted ? "text-stone-400 line-through" : "text-stone-700"}`}>
                          Day {task.day}: {task.title}
                        </Text>
                      </View>
                      <Badge className={catStyle.color}>
                        <Text className="block text-xs font-bold">{catStyle.label}</Text>
                      </Badge>
                    </View>
                  </View>
                  {isExpanded && (
                    <View className="mt-2 ml-9">
                      <Text className="block text-xs text-stone-500 leading-relaxed">{task.desc}</Text>
                      {!isCompleted && !isLocked && !todayCompleted && (
                        <View className="flex flex-row items-center gap-2 mt-2">
                          <Button size="sm" className="bg-teal-400 border-2 border-teal-500 rounded-xl font-bold" onClick={(e) => {
                            e.stopPropagation()
                            handleCompleteTask(task.day)
                          }}
                          >
                            <Text className="block text-xs text-white">完成打卡</Text>
                          </Button>
                          <View className="flex flex-row items-center gap-1 rounded-full bg-yellow-100 border border-yellow-300 px-2 py-1">
                            <Zap size={10} color="#ca8a04" />
                            <Text className="block text-yellow-700 text-xs font-black">+3</Text>
                          </View>
                        </View>
                      )}
                      {!isCompleted && !isLocked && todayCompleted && (
                        <View className="mt-2 bg-stone-100 border-2 border-stone-200 rounded-xl px-3 py-1 inline-block">
                          <Text className="block text-stone-400 text-xs font-bold">今日已打卡，明天继续</Text>
                        </View>
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
        <Card className="border-2 border-yellow-300 bg-gradient-to-b from-yellow-50 to-amber-50 shadow-md">
          <CardContent className="p-3">
            <View className="flex flex-row items-center justify-center gap-2">
              <Trophy size={16} color="#ca8a04" />
              <Text className="block text-yellow-700 text-xs font-bold">
                完成21天计划，获得配得感大师勋章和100成功币奖励！每日打卡+3成功币
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
