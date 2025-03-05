import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold">도서관 시스템</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              최신 도서를 검색하고 대출하세요. 언제 어디서나 편리하게 이용할 수 있습니다.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">바로가기</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/books" className="hover:text-primary">도서 목록</Link>
              <Link href="/search" className="hover:text-primary">도서 검색</Link>
              <Link href="/loans" className="hover:text-primary">대출</Link>
              <Link href="/reservations" className="hover:text-primary">예약</Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">도움말</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/help" className="hover:text-primary">이용 안내</Link>
              <Link href="/faq" className="hover:text-primary">자주 묻는 질문</Link>
              <Link href="/contact" className="hover:text-primary">문의하기</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 도서관 시스템. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 