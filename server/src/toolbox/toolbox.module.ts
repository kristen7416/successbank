import { Module } from '@nestjs/common';
import { ToolboxController } from './toolbox.controller';
import { ToolboxService } from './toolbox.service';
import { AchievementsModule } from '@/achievements/achievements.module';

@Module({
  imports: [AchievementsModule],
  controllers: [ToolboxController],
  providers: [ToolboxService],
  exports: [ToolboxService],
})
export class ToolboxModule {}
