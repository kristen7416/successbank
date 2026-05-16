import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Network } from "@/network";
import { ArrowLeft } from "lucide-react-taro";

const TREE_LEVELS = [
  { level: 0, name: "种子", emoji: "🌰", minCoins: 0, desc: "一切伟大的旅程都从一颗种子开始" },
  { level: 1, name: "嫩芽", emoji: "🌱", minCoins: 5, desc: "小小的嫩芽，充满了无限可能" },
  { level: 2, name: "幼苗", emoji: "🪴", minCoins: 16, desc: "茁壮成长中，每一天都在变强" },
  { level: 3, name: "小树", emoji: "🌿", minCoins: 31, desc: "已经可以自己站稳了" },
  { level: 4, name: "青年树", emoji: "🎋", minCoins: 46, desc: "枝叶渐丰，开始为他人遮风" },
  { level: 5, name: "大树", emoji: "🌳", minCoins: 52, desc: "根深叶茂，坚定而自信" },
  { level: 6, name: "参天大树", emoji: "🎄", minCoins: 70, desc: "你是这片花园最闪耀的存在" },
];

export default function Garden() {
  const [treeState, setTreeState] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [growing, setGrowing] = useState(false);
  const [growMessage, setGrowMessage] = useState("");
  const [bugRemoving, setBugRemoving] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number; x: number; y: number; delay: number}>>([]);

  const fetchTreeState = async () => {
    try {
      const res = await Network.request({ url: "/api/tree" });
      console.log("[Garden] tree state:", res.data);
      setTreeState(res.data?.data || res.data);
    } catch (err) {
      console.error("[Garden] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreeState();
  }, []);

  const handleGrow = async () => {
    if (growing) return;
    setGrowing(true);
    try {
      const res = await Network.request({ url: "/api/tree/grow", method: "POST" });
      console.log("[Garden] grow result:", res.data);
      const data = res.data?.data || res.data;
      if (data.grew) {
        setGrowMessage(data.message || "树木成长了！");
        addSparkles();
      } else {
        setGrowMessage(data.message || "还需要更多成功币才能成长哦");
      }
      await fetchTreeState();
    } catch (err) {
      console.error("[Garden] grow error:", err);
    } finally {
      setGrowing(false);
      setTimeout(() => setGrowMessage(""), 3000);
    }
  };

  const handleRemoveBug = async () => {
    if (bugRemoving) return;
    setBugRemoving(true);
    try {
      const res = await Network.request({ url: "/api/tree/remove-bug", method: "POST" });
      console.log("[Garden] remove bug:", res.data);
      await fetchTreeState();
    } catch (err) {
      console.error("[Garden] bug error:", err);
    } finally {
      setBugRemoving(false);
    }
  };

  const addSparkles = () => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 30,
      delay: Math.random() * 0.5,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 2000);
  };

  if (loading) {
    return (
      <View className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Text className="block text-amber-400 text-lg">🌿 花园加载中...</Text>
      </View>
    );
  }

  const currentLevel = treeState?.growth_level || 0;
  const levelInfo = TREE_LEVELS[currentLevel] || TREE_LEVELS[0];
  const nextLevelInfo = TREE_LEVELS[currentLevel + 1];
  const hasBug = treeState?.has_bug || false;
  const totalCoins = treeState?.total_coins || 0;
  const canGrow = treeState?.can_grow || false;

  const progressPercent = nextLevelInfo
    ? Math.min(
        100,
        Math.round(
          ((totalCoins - levelInfo.minCoins) /
            (nextLevelInfo.minCoins - levelInfo.minCoins)) *
            100
        )
      )
    : 100;

  return (
    <View className="min-h-screen bg-amber-50">
      {/* Header */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "12px 16px",
          paddingTop: "48px",
        }}
      >
        <View onClick={() => Taro.navigateBack()} style={{ padding: "4px" }}>
          <ArrowLeft size={22} color="#78350f" />
        </View>
        <Text className="block text-amber-900 text-lg font-bold ml-2">
          成功花园
        </Text>
      </View>

      {/* Main Tree Scene */}
      <View className="mx-4 rounded-3xl border-2 border-green-300 bg-gradient-to-b from-sky-100 to-green-100 relative overflow-hidden" style={{ minHeight: "320px" }}>
        {/* Sky decorations */}
        <View style={{ position: "absolute", top: "16px", right: "24px" }}>
          <Text style={{ fontSize: "28px" }}>☁️</Text>
        </View>
        <View style={{ position: "absolute", top: "32px", left: "20px" }}>
          <Text style={{ fontSize: "20px" }}>☁️</Text>
        </View>
        <View style={{ position: "absolute", top: "10px", left: "50%" }}>
          <Text style={{ fontSize: "32px" }}>☀️</Text>
        </View>

        {/* Tree */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingTop: "60px",
            paddingBottom: "20px",
            minHeight: "260px",
          }}
        >
          {/* Sparkles */}
          {sparkles.map((s) => (
            <Text
              key={s.id}
              style={{
                position: "absolute",
                left: s.x + "%",
                top: s.y + "%",
                fontSize: "20px",
                opacity: 0.9,
              }}
            >
              ✨
            </Text>
          ))}

          {/* Tree Emoji - size based on level */}
          <Text
            style={{
              fontSize: currentLevel >= 5 ? "80px" : currentLevel >= 3 ? "64px" : currentLevel >= 1 ? "48px" : "36px",
              lineHeight: "1.2",
            }}
          >
            {levelInfo.emoji}
          </Text>

          {/* Bug overlay */}
          {hasBug && (
            <View style={{ position: "absolute", bottom: "60px", right: "30%" }}>
              <Text style={{ fontSize: "24px" }}>🐛</Text>
            </View>
          )}

          {/* Ground */}
          <View
            style={{
              width: "80%",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#86efac",
              marginTop: "4px",
            }}
          />
        </View>

        {/* Grow message */}
        {growMessage && (
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              padding: "12px 20px",
              borderWidth: "2px",
              borderColor: "#86efac",
            }}
          >
            <Text className="block text-green-700 font-bold text-center text-base">
              {growMessage}
            </Text>
          </View>
        )}
      </View>

      {/* Level Info Card */}
      <View className="mx-4 mt-4 rounded-2xl border-2 border-amber-300 bg-white p-4">
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text className="block text-amber-900 font-bold text-base">
              {levelInfo.emoji} {levelInfo.name}
            </Text>
            <Text className="block text-amber-600 text-sm mt-1">
              {levelInfo.desc}
            </Text>
          </View>
          <View className="bg-amber-100 rounded-full px-3 py-1">
            <Text className="block text-amber-700 text-xs font-bold">
              Lv.{currentLevel}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        {nextLevelInfo && (
          <View className="mt-3">
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text className="block text-amber-500 text-xs">
                {totalCoins} 成功币
              </Text>
              <Text className="block text-amber-500 text-xs">
                下一级: {nextLevelInfo.minCoins}币 ({nextLevelInfo.emoji}{nextLevelInfo.name})
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: "10px",
                borderRadius: "5px",
                backgroundColor: "#fef3c7",
                marginTop: "6px",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: progressPercent + "%",
                  height: "100%",
                  borderRadius: "5px",
                  backgroundColor: "#86efac",
                }}
              />
            </View>
          </View>
        )}

        {!nextLevelInfo && (
          <View className="mt-3 bg-green-50 rounded-xl p-3">
            <Text className="block text-green-700 text-sm font-bold text-center">
              🎉 已达最高等级！你的生命之树无比辉煌！
            </Text>
          </View>
        )}
      </View>

      {/* Bug Alert */}
      {hasBug && (
        <View className="mx-4 mt-3 rounded-2xl border-2 border-red-300 bg-red-50 p-4">
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: "24px", marginRight: "8px" }}>🐛</Text>
              <View>
                <Text className="block text-red-700 font-bold text-sm">
                  发现小虫子！
                </Text>
                <Text className="block text-red-500 text-xs">
                  昨日任务未完成，小虫子来捣乱了
                </Text>
              </View>
            </View>
            <View
              onClick={handleRemoveBug}
              className="rounded-full bg-red-500 px-4 py-2"
            >
              <Text className="block text-white text-xs font-bold">
                {bugRemoving ? "除虫中..." : "除虫"}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View className="mx-4 mt-4" style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
        {canGrow && (
          <View
            onClick={handleGrow}
            className="flex-1 rounded-2xl border-2 border-green-400 bg-green-500 p-3"
            style={{ flex: 1 }}
          >
            <Text className="block text-white font-bold text-center">
              {growing ? "成长中..." : "🌿 浇水成长"}
            </Text>
          </View>
        )}
        <View
          onClick={() => Taro.switchTab({ url: "/pages/deposit/index" })}
          className="rounded-2xl border-2 border-amber-300 bg-amber-400 p-3"
          style={{ flex: 1 }}
        >
          <Text className="block text-white font-bold text-center">
            💰 存入成功
          </Text>
        </View>
      </View>

      {/* Growth Timeline */}
      <View className="mx-4 mt-4 mb-6 rounded-2xl border-2 border-teal-300 bg-white p-4">
        <Text className="block text-teal-700 font-bold text-sm mb-3">
          🌳 成长历程
        </Text>
        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px" }}>
          {TREE_LEVELS.map((lv) => {
            const isCurrent = lv.level === currentLevel;
            const isUnlocked = lv.level <= currentLevel;
            return (
              <View
                key={lv.level}
                className={`rounded-xl px-3 py-2 border-2 ${
                  isCurrent
                    ? "border-green-400 bg-green-50"
                    : isUnlocked
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Text
                  style={{
                    fontSize: "20px",
                    opacity: isUnlocked ? 1 : 0.4,
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  {lv.emoji}
                </Text>
                <Text
                  className={`block text-center text-xs mt-1 ${
                    isCurrent ? "text-green-700 font-bold" : isUnlocked ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {lv.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
