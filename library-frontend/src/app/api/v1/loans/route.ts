import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 대출 목록 조회 (GET /api/v1/loans?userId={userId})
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터에서 userId 가져오기
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    // 백엔드 API로 요청 전송
    const response = await fetch(`${API_URL}/loans?userId=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'No loans found for this user' },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch loans: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loans' },
      { status: 500 }
    );
  }
}

// 새 대출 생성 (POST /api/v1/loans)
export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 대출 데이터 가져오기
    const loanData = await request.json();
    
    // 백엔드 API로 요청 전송
    const response = await fetch(`${API_URL}/loans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loanData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      throw new Error(`Failed to create loan: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json(
      { error: 'Failed to create loan' },
      { status: 500 }
    );
  }
} 