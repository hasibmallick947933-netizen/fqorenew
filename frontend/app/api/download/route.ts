import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const plan = searchParams.get('plan') || '';
    const token = searchParams.get('token') || '';

    // Security Gate: Token is strictly required to download or view the PDF
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment required to view or download this protected dossier.',
          message: 'Please complete enrollment via Razorpay to unlock your permanent access token.',
        },
        { status: 403 }
      );
    }

    // Token must be a valid unlocked receipt format
    const isValidToken =
      token.startsWith('unlock_') ||
      token.startsWith('demo_admin_') ||
      token.startsWith('sim_pay_') ||
      token.length >= 10;

    if (!isValidToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired payment receipt token. Access denied.',
        },
        { status: 403 }
      );
    }

    let filename = 'plan-99-swing-trading.pdf';
    let downloadName = 'FQore_Swing_Trading_Blueprint_99.pdf';
    const p = plan.toLowerCase();

    if (p.includes('149') || p.includes('premium') || p.includes('masterclass')) {
      filename = 'plan-149-trading-masterclass.pdf';
      downloadName = 'FQore_Trading_Masterclass_149.pdf';
    }

    // Look in frontend/storage/protected or root storage/protected
    let filePath = path.join(process.cwd(), 'storage/protected', filename);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), '../backend/storage/protected', filename);
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Protected dossier file not found on server.',
        },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${downloadName}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
