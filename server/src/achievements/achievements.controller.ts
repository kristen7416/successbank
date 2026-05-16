import { Controller, Get, Post, Body } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  // 获取所有成就（含定义+解锁状态）
  @Get()
  async getAchievements() {
    console.log('[AchievementsController] GET /api/achievements');
    const achievements = await this.achievementsService.getAchievements();
    return { code: 200, msg: 'success', data: achievements };
  }

  // 自动检测并解锁应得成就
  @Post('check')
  async checkAndUnlock() {
    console.log('[AchievementsController] POST /api/achievements/check');
    const result = await this.achievementsService.checkAndUnlockAll();
    return { code: 200, msg: 'success', data: result };
  }

  // 手动解锁单个成就
  @Post()
  async unlockAchievement(@Body() body: { achievement_id: string }) {
    console.log('[AchievementsController] POST /api/achievements', body);
    const result = await this.achievementsService.unlockAchievement(body.achievement_id);
    return { code: 200, msg: 'success', data: result };
  }
}
