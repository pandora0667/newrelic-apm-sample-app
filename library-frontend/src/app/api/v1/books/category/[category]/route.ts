import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 카테고리별 도서 목록 조회 (GET /api/v1/books/category/{category})
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // 백엔드 서버에서 데이터 가져오기
    const response = await fetch(`${API_URL}/books/category/${category}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching books by category: ${response.status}`);
    }

    const data = await response.json();
    
    // 백엔드 연결 완료 - 실제 데이터 반환
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching books by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books by category' },
      { status: 500 }
    );
  }
} 