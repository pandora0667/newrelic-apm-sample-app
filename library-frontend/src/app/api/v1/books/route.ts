import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 도서 목록 조회 (GET /api/v1/books)
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터에서 페이지와 사이즈 정보 가져오기
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '20');
    const format = searchParams.get('format') || 'paginated'; // 'array' 또는 'paginated'

    // 백엔드 서버에서 모든 데이터 가져오기 (페이지네이션이 작동하지 않는 것 같으므로)
    const response = await fetch(`${API_URL}/books`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching books: ${response.status}`);
    }

    // 서버에서 데이터 가져오기
    const allBooks = await response.json();
    
    // 응답에서 중복된 bookId 제거 (백엔드에서 중복이 있을 경우 대비)
    const uniqueBookIds = new Set();
    const uniqueBooks = Array.isArray(allBooks) ? allBooks.filter(book => {
      if (!uniqueBookIds.has(book.bookId)) {
        uniqueBookIds.add(book.bookId);
        return true;
      }
      console.warn(`API 응답에서 중복된 bookId 발견: ${book.bookId}`);
      return false;
    }) : allBooks;
    
    // format=array 파라미터가 있으면 배열 형태로 반환
    if (format === 'array') {
      return NextResponse.json(uniqueBooks);
    }
    
    // 클라이언트 사이드 페이지네이션 구현
    const totalCount = uniqueBooks.length;
    const totalPages = Math.ceil(totalCount / size);
    
    // 요청된 페이지에 해당하는 도서만 잘라서 반환
    const startIndex = page * size;
    const endIndex = Math.min(startIndex + size, totalCount);
    const paginatedBooks = uniqueBooks.slice(startIndex, endIndex);
    
    console.log(`클라이언트 페이지네이션: 전체 ${totalCount}권 중 ${startIndex}-${endIndex}까지 반환 (페이지:${page}, 크기:${size})`);
    
    // 표준 페이지네이션 응답 형식으로 변환
    const paginatedResponse = {
      content: paginatedBooks,
      totalElements: totalCount,
      totalPages: totalPages,
      size: size,
      number: page,
      hasNext: page < totalPages - 1
    };
    
    // 변환된 페이지네이션 응답 반환
    return NextResponse.json(paginatedResponse);
    
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// 전체 도서 수는 이제 직접 계산하므로 이 함수는 불필요합니다
// async function getTotalBooksCount(): Promise<number> { ... } 

// 도서 등록 (POST /api/v1/books)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 백엔드 서버로 요청 전송
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error creating book: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
} 