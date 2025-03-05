import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 대출 연장 - 기본 일수 (POST /api/v1/loans/{loanId}/extend/default)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ loanId: string }> }
) {
  try {
    const { loanId } = await params;
    
    // 백엔드 서버로 기본 일수 연장 요청 전송
    const response = await fetch(`${API_URL}/loans/${loanId}/extend/default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Loan not found' },
          { status: 404 }
        );
      } else if (response.status === 400) {
        return NextResponse.json(
          { error: 'Maximum extension limit reached' },
          { status: 400 }
        );
      }
      throw new Error(`Failed to extend loan with default days: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error extending loan with default days:', error);
    return NextResponse.json(
      { error: 'Failed to extend loan with default days' },
      { status: 500 }
    );
  }
} 