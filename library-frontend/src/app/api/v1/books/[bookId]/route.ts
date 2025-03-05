import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 도서 상세 조회 (GET /api/v1/books/{bookId})
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;

    // 백엔드 서버에서 데이터 가져오기
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        );
      }
      throw new Error(`Error fetching book details: ${response.status}`);
    }

    const data = await response.json();
    
    // 백엔드 연결 완료 - 실제 데이터 반환
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching book details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book details' },
      { status: 500 }
    );
  }
}

// 도서 정보 수정 (PUT /api/v1/books/{bookId})
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const body = await request.json();

    // 날짜 형식 변환 (YYYY-MM-DD)
    const requestBody = {
      ...body,
      publishedDate: body.publishedDate ? new Date(body.publishedDate).toISOString().split('T')[0] : undefined
    };

    // 백엔드 서버로 요청 전송
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        );
      }
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to update book' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// 도서 삭제 (DELETE /api/v1/books/{bookId})
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;

    // 백엔드 서버로 요청 전송
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        );
      } else if (response.status === 409) {
        return NextResponse.json(
          { error: 'Book has active loans or reservations' },
          { status: 409 }
        );
      }
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete book' },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
    
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 