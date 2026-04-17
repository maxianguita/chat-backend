import { Controller, Post, Body, Req, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { admin } from './firebase/firebase.config';

@Controller()
export class AppController {

  @Post('chat')
  async chat(@Body('message') message: string, @Req() req: any) {

    console.log(" Mensaje recibido:", message);

    //  Validación mensaje
    if (!message || typeof message !== 'string' || message.trim() === '') {
      throw new BadRequestException('Mensaje inválido');
    }

    // Obtener token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return { reply: 'No autorizado' };
    }

    try {
      // Validar usuario Firebase
      const decoded = await admin.auth().verifyIdToken(token);

      console.log(" USER:", decoded.email);

    } catch (error) {
      console.error(" Token inválido");
      return { reply: 'Token inválido' };
    }

    try {
      console.log(" Enviando a OpenAI...");

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(" Respuesta OpenAI OK");

      return {
        reply: response.data.choices?.[0]?.message?.content || 'Sin respuesta',
      };

    } catch (error: any) {
      console.error(" ERROR IA:", error?.response?.data || error.message);

      //  fallback para demo (por si no tengo créditos)
     return {
      reply: "Hola! 👋 Estoy en modo demo por el momento, pero puedo ayudarte igual. ¿En qué puedo asistirte?"
};
    }
  }
}