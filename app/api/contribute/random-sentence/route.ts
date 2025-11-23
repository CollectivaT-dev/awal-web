import { NextRequest, NextResponse } from 'next/server';

const LANGUAGE_CODE_TO_TATOEBA: Record<string, string> = {
    'ca': 'cat',
    'en': 'eng',
    'es': 'spa',
    'fr': 'fra',
    'zgh': 'zgh',
    'ber': 'ber',
    'ary': 'ary',
    'ar': 'ara',
    'de': 'deu',
    'nl': 'nld',
    'ru': 'rus',
    'it': 'ita',
    'tr': 'tur',
    'eo': 'epo',
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const langCode = searchParams.get('lang');

    if (!langCode) {
        return NextResponse.json({ error: 'Language code required' }, { status: 400 });
    }

    const tatoebaLangCode = LANGUAGE_CODE_TO_TATOEBA[langCode];

    if (!tatoebaLangCode) {
        return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    try {
        const url = `https://tatoeba.org/en/sentences/show/${tatoebaLangCode}`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const html = await response.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/);

        if (!titleMatch) {
            throw new Error('Could not extract sentence');
        }

        const sentence = titleMatch[1].split(' - ')[0].trim();

        return NextResponse.json({ sentence });
    } catch (error) {
        console.error('Error fetching random sentence:', error);
        return NextResponse.json({ error: 'Failed to fetch sentence' }, { status: 500 });
    }
}
