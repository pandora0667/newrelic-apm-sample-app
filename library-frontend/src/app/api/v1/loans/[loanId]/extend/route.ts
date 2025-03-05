import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 대출 연장 - 일수 지정 (POST /api/v1/loans/{loanId}/extend)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ loanId: string }> }
) {
  try {
    const { loanId } = await params;
    
    // 요청 본문에서 연장 일수 가져오기
    const requestBody = await request.json();
    
    // 백엔드 서버로 연장 요청 전송
    const response = await fetch(`${API_URL}/loans/${loanId}/extend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Loan not found' },
          { status: 404 }
        );
      } else if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid extension request' },
          { status: 400 }
        );
      }
      throw new Error(`Failed to extend loan: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error extending loan:', error);
    return NextResponse.json(
      { error: 'Failed to extend loan' },
      { status: 500 }
    );
  }
} 