import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: Response) {

    const { searchParams } = new URL(req.url);

    const locale = searchParams.get('locale');

    const filePath = path.join(process.cwd(), 'static', 'mdx', 'policies', `policies.${locale}.mdx`);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    return new NextResponse(JSON.stringify(fileContent), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
