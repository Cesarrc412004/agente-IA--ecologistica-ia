import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// 1. Corregimos la importación al nombre correcto del SDK
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 2. Instanciamos con la clase correcta
const ai = new GoogleGenerativeAI(process.env.IA_API_KEY);

app.post('/api/chat', async (req, res) => {
  const { mensaje } = req.body;

  try {
    // 3. Obtenemos el modelo primero
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      // Las instrucciones del sistema se pasan al inicializar el modelo aquí
      systemInstruction: "Actúa EXCLUSIVAMENTE como el agente inteligente de soporte técnico y auditoría interna para la empresa EcoLogística S.A. Está estrictamente prohibido decir que eres un modelo de lenguaje de Google o una IA genérica. Responde siempre asumiendo tu rol corporativo de manera concisa, amable y profesional sobre logística, envíos e inventarios sustentables.",
    });

    // 4. Llamamos a generar contenido pasando el mensaje del usuario
    const resultado = await model.generateContent(mensaje);
    const respuestaIA = resultado.response;

    res.json({ respuesta: respuestaIA.text() }); // .text() es una función en este SDK
  } catch (error) {
    console.error("Error en la petición a Gemini:", error);
    res.status(500).json({ error: "Hubo un problema al procesar tu mensaje con Gemini." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor de EcoLogística (Gemini) corriendo en http://localhost:${PORT}`));
export default app;