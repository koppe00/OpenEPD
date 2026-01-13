import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * API Route for audio transcription using Google Gemini 2.5
 * 
 * This endpoint receives an audio file and returns the transcribed text using Gemini's audio capabilities.
 * 
 * @example
 * POST /api/transcribe
 * Body: FormData with 'audio' file field
 * Response: { transcript: string }
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Use Voice Assistant Gemini API key
    const geminiKey = process.env.VOICE_ASSISTANT_GEMINI_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!geminiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    try {
      // Convert audio file to base64
      const arrayBuffer = await audioFile.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');
      
      // Determine MIME type
      const mimeType = audioFile.type || 'audio/webm';

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ 
        model: process.env.VOICE_ASSISTANT_GEMINI_MODEL || 'gemini-2.5-flash-lite' 
      });

      console.log(`🎤 Transcribing audio (${audioFile.size} bytes) using Gemini...`);

      // Gemini audio transcription prompt
      const prompt = `
Transcribeer de volgende audio in het Nederlands. 
Geef alleen de gesproken tekst terug, zonder opmaak of extra commentaar.
Dit is een medisch consult, let op medische terminologie.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Audio
          }
        }
      ]);

      const transcript = result.response.text().trim();
      
      console.log('✅ Gemini transcription successful:', transcript.substring(0, 100) + '...');

      return NextResponse.json({ 
        transcript,
        metadata: {
          size: audioFile.size,
          mimeType: mimeType,
          source: 'gemini-audio',
          model: process.env.VOICE_ASSISTANT_GEMINI_MODEL || 'gemini-2.5-flash-lite'
        }
      });

    } catch (geminiError: any) {
      console.error('Gemini transcription failed:', geminiError);
      
      // Check for quota errors
      if (geminiError?.message?.includes('quota') || geminiError?.message?.includes('429')) {
        return NextResponse.json({ 
          error: 'API quota bereikt. Wacht even en probeer opnieuw.' 
        }, { status: 429 });
      }
      
      return NextResponse.json({ 
        error: `Transcriptie mislukt: ${geminiError.message || 'Unknown error'}` 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed', details: String(error) },
      { status: 500 }
    );
  }
}
