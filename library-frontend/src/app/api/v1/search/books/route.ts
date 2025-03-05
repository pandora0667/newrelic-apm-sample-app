import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 도서 검색 (GET /api/v1/search/books)
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 가져오기
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const author = searchParams.get('author') || '';
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    
    // 백엔드 API URL 생성
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append('keyword', keyword);
    if (category) queryParams.append('category', category);
    if (author) queryParams.append('author', author);
    queryParams.append('page', page);
    queryParams.append('size', size);
    
    const apiUrl = `${API_URL}/search/books?${queryParams.toString()}`;
    
    console.log(`검색 API 호출: ${apiUrl}`);
    
    // 백엔드 API 호출
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error searching books: ${response.status}`);
    }
    
    // 응답 데이터 받기
    const searchResult = await response.json();
    
    // 클라이언트에 응답 전송
    return NextResponse.json(searchResult);
  } catch (error) {
    console.error('Error searching books:', error);
    return NextResponse.json(
      { error: 'Failed to search books' },
      { status: 500 }
    );
  }
} 