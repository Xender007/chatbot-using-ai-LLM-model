import { Body, Controller, Post } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    return this.faqService.answerQuestion(body.question);
  }
}
