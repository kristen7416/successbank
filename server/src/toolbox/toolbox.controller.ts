import { Controller, Get, Post, Body } from '@nestjs/common';
import { ToolboxService } from './toolbox.service';
import { AchievementsService } from '@/achievements/achievements.service';

@Controller('toolbox')
export class ToolboxController {
  constructor(
    private readonly toolboxService: ToolboxService,
    private readonly achievementsService: AchievementsService,
  ) {}

  // 保存自我肯定
  @Post('affirmation')
  async saveAffirmation(@Body() body: { content: string }) {
    console.log('[ToolboxController] POST /api/toolbox/affirmation', body);
    const result = await this.toolboxService.saveAffirmation(body.content);
    this.achievementsService.checkAndUnlockAll().catch(() => {});
    return { code: 200, msg: 'success', data: result };
  }

  // 保存感恩日记
  @Post('gratitude')
  async saveGratitude(@Body() body: { items: string[] }) {
    console.log('[ToolboxController] POST /api/toolbox/gratitude', body);
    const result = await this.toolboxService.saveGratitude(body.items);
    this.achievementsService.checkAndUnlockAll().catch(() => {});
    return { code: 200, msg: 'success', data: result };
  }

  // 保存价值条件化
  @Post('value-conditions')
  async saveValueConditions(@Body() body: { condition?: string; refutation?: string; conditions?: Array<{ condition: string; rewrite: string }> }) {
    console.log('[ToolboxController] POST /api/toolbox/value-conditions', body);
    // 支持单条和多条两种格式
    const conditions = body.conditions || (body.condition ? [{ condition: body.condition, rewrite: body.refutation || '' }] : []);
    const result = await this.toolboxService.saveValueConditions(conditions);
    this.achievementsService.checkAndUnlockAll().catch(() => {});
    return { code: 200, msg: 'success', data: result?.[0] || null };
  }
}
