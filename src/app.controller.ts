import { Controller, Post, Body, Req, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { admin } from './firebase/firebase.config';

@Controller()
export class AppController {

  @Post('chat')
  async chat(@Body('message') message: string, @Req() req: any) {
  console.log("ENTRO A CHAT");
  console.log("KEY BACK:", process.env.OPENROUTER_API_KEY);
    console.log("Mensaje recibido:", message);

    // Validación mensaje
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
      // console.log("USER:", decoded.email);
    } catch (error) {
      console.error("Token inválido");
      return { reply: 'Token inválido' };
    }

    try {
      console.log("Enviando a OpenRouter...");
// 🔁 IMPLEMENTACIÓN ANTERIOR (OpenAI)
// const response = await axios.post(
//   'https://api.openai.com/v1/chat/completions',
//   {
//     model: 'gpt-4o-mini',
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: message },
//     ],
//   },
//   {
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//   },
// );

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
         model: 'openai/gpt-4o-mini',
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
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Chat App',
          },
        },
      );

      console.log("Respuesta OpenRouter OK");

      return {
        reply: response.data.choices?.[0]?.message?.content || 'Sin respuesta',
      };

    } catch (error: any) {
  console.error("❌ ERROR IA COMPLETO:", error);
  console.error("❌ ERROR IA RESPONSE:", error?.response?.data);
  console.error("❌ ERROR IA STATUS:", error?.response?.status);

  return {
    reply: "Error real en consola "
 
  };
}
  }
}