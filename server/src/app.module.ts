import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DepositsModule } from '@/deposits/deposits.module';
import { TasksModule } from '@/tasks/tasks.module';
import { ToolboxModule } from '@/toolbox/toolbox.module';
import { AchievementsModule } from '@/achievements/achievements.module';
import { TreeModule } from '@/tree/tree.module';

@Module({
  imports: [DepositsModule, TasksModule, ToolboxModule, AchievementsModule, TreeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
