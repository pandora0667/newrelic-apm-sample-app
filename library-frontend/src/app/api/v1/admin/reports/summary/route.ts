import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/admin/reports/summary`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin reports' },
      { status: 500 }
    );
  }
} 