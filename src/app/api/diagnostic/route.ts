import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Verificação de autenticação — apenas usuários logados podem enviar dados
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await req.json();
    const { nomeClinica, faturamento, gargalo, investimento, whatsapp, email } = body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'data!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          nomeClinica, 
          faturamento, 
          gargalo, 
          investimento, 
          whatsapp, 
          email, 
          new Date().toLocaleString('pt-BR')
        ]],
      },
    });

    return NextResponse.json({ message: 'Dados salvos com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao salvar na planilha' }, { status: 500 });
  }
}