import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale');

    const filePath = path.join(process.cwd(), 'static', 'mdx', 'policies', `cookies`, `cookies.${locale}.mdx`);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');

    const { content, data } = matter(fileContent);

    const response = {
        frontMatter: data,
        content: content,
    };

    return new NextResponse(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
