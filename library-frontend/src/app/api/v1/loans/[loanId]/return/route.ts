import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 도서 반납 (POST /api/v1/loans/{loanId}/return)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ loanId: string }> }
) {
  try {
    const { loanId } = await params;
    
    // 요청 본문에서 반납 날짜 가져오기
    const requestBody = await request.json();
    
    // 백엔드 서버로 반납 요청 전송
    const response = await fetch(`${API_URL}/loans/${loanId}/return`, {
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
      }
      throw new Error(`Failed to return book: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error returning book:', error);
    return NextResponse.json(
      { error: 'Failed to return book' },
      { status: 500 }
    );
  }
} 