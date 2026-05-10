import { Module } from '@nestjs/common';
import { ToolboxController } from './toolbox.controller';
import { ToolboxService } from './toolbox.service';

@Module({
  controllers: [ToolboxController],
  providers: [ToolboxService],
  exports: [ToolboxService],
})
export class ToolboxModule {}
