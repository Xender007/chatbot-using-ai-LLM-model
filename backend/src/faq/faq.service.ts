import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FaqService {
  async answerQuestion(question: string) {
    const embedRes = await axios.post('http://localhost:8000/embed', {
      text: question,
    });

    const queryVector = embedRes.data.embedding;

    const results = await axios.post('http://localhost:8000/query', {
      query_vector: queryVector,
      top_k: 3,
    });

    const context = results.data.matches.map((m) => m.document).join('\n');

    const answerRes = await axios.post('http://localhost:8000/answer', {
      question,
      context,
    });

    return answerRes.data;
  }
}
