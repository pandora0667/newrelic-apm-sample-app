import Link from 'next/link';
import Image from 'next/image';
import { Book, Search, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout';

const features = [
  {
    icon: Book,
    title: '도서 목록',
    description: '다양한 장르의 도서를 살펴보세요.',
    href: '/books',
  },
  {
    icon: Search,
    title: '도서 검색',
    description: '원하는 도서를 빠르게 찾아보세요.',
    href: '/search',
  },
  {
    icon: BookOpen,
    title: '도서 대출',
    description: '관심 있는 도서를 대출하고 읽어보세요.',
    href: '/loans',
  },
  {
    icon: Calendar,
    title: '도서 예약',
    description: '대출 중인 도서를 미리 예약하세요.',
    href: '/reservations',
  },
];

export default function Home() {
  return (
    <MainLayout>
      {/* 히어로 섹션 */}
      <section className="py-12 md:py-24">
        <div className="w-full">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  도서관 시스템에 오신 것을 환영합니다
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  최신 도서를 검색하고 대출하세요. 언제 어디서나 편리하게 이용할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/books">
                  <Button size="lg">도서 둘러보기</Button>
                </Link>
                <Link href="/search">
                  <Button size="lg" variant="outline">도서 검색하기</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2940&auto=format&fit=crop"
                alt="도서관 이미지"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">주요 기능</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                도서관 시스템의 다양한 기능을 이용해보세요.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="flex flex-col items-center space-y-2 p-6 bg-background rounded-lg border border-border transition-colors hover:bg-muted"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-12 md:py-24">
        <div className="w-full">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-background rounded-lg border border-border">
              <h3 className="text-3xl font-bold">1,500+</h3>
              <p className="text-sm text-muted-foreground text-center">보유 도서</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-background rounded-lg border border-border">
              <h3 className="text-3xl font-bold">300+</h3>
              <p className="text-sm text-muted-foreground text-center">월간 대출</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-background rounded-lg border border-border">
              <h3 className="text-3xl font-bold">75+</h3>
              <p className="text-sm text-muted-foreground text-center">월간 예약</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-background rounded-lg border border-border">
              <h3 className="text-3xl font-bold">200+</h3>
              <p className="text-sm text-muted-foreground text-center">활성 사용자</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 