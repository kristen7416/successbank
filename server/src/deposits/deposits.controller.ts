import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DepositsService } from './deposits.service';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  // 创建成功存款
  @Post()
  async createDeposit(@Body() body: {
    content: string;
    type?: string;
    emotion?: string;
    difficulty?: string;
    coins?: number;
    note?: string;
  }) {
    console.log('[DepositsController] POST /api/deposits', body);
    const result = await this.depositsService.createDeposit(body);
    return { code: 200, msg: 'success', data: result };
  }

  // 获取存款列表
  @Get()
  async getDeposits(@Query('limit') limit?: string) {
    const lim = parseInt(limit || '20', 10);
    console.log('[DepositsController] GET /api/deposits limit=', lim);
    const list = await this.depositsService.getDeposits(lim);
    return { code: 200, msg: 'success', data: { list } };
  }

  // 获取存款统计
  @Get('stats')
  async getStats() {
    console.log('[DepositsController] GET /api/deposits/stats');
    const stats = await this.depositsService.getStats();
    return { code: 200, msg: 'success', data: stats };
  }
}
