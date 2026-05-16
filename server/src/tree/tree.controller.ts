import { Controller, Get, Post } from '@nestjs/common';
import { TreeService } from './tree.service';

@Controller('tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  // 获取树木状态
  @Get()
  async getTreeState() {
    console.log('[TreeController] GET /api/tree');
    const state = await this.treeService.getTreeState();
    return { code: 200, msg: 'success', data: state };
  }

  // 检查并更新树木生长（每次访问花园时调用）
  @Post('grow')
  async growTree() {
    console.log('[TreeController] POST /api/tree/grow');
    const result = await this.treeService.checkAndGrow();
    return { code: 200, msg: 'success', data: result };
  }

  // 除虫（完成任务后自动调用）
  @Post('remove-bug')
  async removeBug() {
    console.log('[TreeController] POST /api/tree/remove-bug');
    const result = await this.treeService.removeBug();
    return { code: 200, msg: 'success', data: result };
  }

  // 检查昨日任务是否完成（进入花园时调用）
  @Post('check-bug')
  async checkBug() {
    console.log('[TreeController] POST /api/tree/check-bug');
    const result = await this.treeService.checkYesterdayTask();
    return { code: 200, msg: 'success', data: result };
  }
}
