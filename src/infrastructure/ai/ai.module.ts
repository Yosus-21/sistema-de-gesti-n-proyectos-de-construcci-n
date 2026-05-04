import { Module } from '@nestjs/common';
import { AI_MATERIAL_ASSIGNMENT_PORT } from './ai-material-assignment.port';
import { GeminiMaterialAssignmentService } from './gemini-material-assignment.service';
import { AI_MATERIAL_FORECAST_PORT } from './ai-material-forecast.port';
import { GeminiMaterialForecastService } from './gemini-material-forecast.service';

@Module({
  providers: [
    {
      provide: AI_MATERIAL_ASSIGNMENT_PORT,
      useClass: GeminiMaterialAssignmentService,
    },
    {
      provide: AI_MATERIAL_FORECAST_PORT,
      useClass: GeminiMaterialForecastService,
    },
  ],
  exports: [AI_MATERIAL_ASSIGNMENT_PORT, AI_MATERIAL_FORECAST_PORT],
})
export class AiModule {}
