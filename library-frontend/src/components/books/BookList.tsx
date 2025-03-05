import Link from 'next/link';
import { BookSimple } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (err) {
    console.error('Error formatting date:', err);
    return dateString;
  }
};

interface BookListProps {
  books: BookSimple[];
  viewMode: 'grid' | 'list';
}

export function BookList({ books, viewMode }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">도서를 찾을 수 없습니다</h3>
        <p className="text-muted-foreground mt-2">
          선택한 카테고리에 해당하는 도서가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
      {books.map((book) => (
        <Link key={book.bookId} href={`/books/${book.bookId}`} className="block">
          {viewMode === 'grid' ? (
            <GridBookCard book={book} />
          ) : (
            <ListBookItem book={book} />
          )}
        </Link>
      ))}
    </div>
  );
}

function GridBookCard({ book }: { book: BookSimple }) {
  return (
    <Card className="h-full transition-all hover:bg-muted/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2 text-base font-semibold leading-tight">
            {book.title}
          </CardTitle>
          <Badge className="ml-2 shrink-0" variant={book.copiesAvailable > 0 ? 'default' : 'outline'}>
            {book.copiesAvailable > 0 ? '대출 가능' : '대출 중'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>저자: {book.author}</p>
          <p>카테고리: {book.category}</p>
          <p>출판일: {formatDate(book.publishedDate)}</p>
          <p>ISBN: {book.isbn}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-sm font-medium">
          남은 수량: {book.copiesAvailable}권
        </div>
      </CardFooter>
    </Card>
  );
}

function ListBookItem({ book }: { book: BookSimple }) {
  return (
    <Card className="transition-all hover:bg-muted/50">
      <div className="flex p-4 items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold">{book.title}</h3>
          <div className="text-sm text-muted-foreground mt-1">
            <p>저자: {book.author} · 카테고리: {book.category} · 출판일: {formatDate(book.publishedDate)}</p>
            <p>ISBN: {book.isbn}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={book.copiesAvailable > 0 ? 'default' : 'outline'}>
            {book.copiesAvailable > 0 ? '대출 가능' : '대출 중'}
          </Badge>
          <div className="text-sm font-medium">
            남은 수량: {book.copiesAvailable}권
          </div>
        </div>
      </div>
    </Card>
  );
} 