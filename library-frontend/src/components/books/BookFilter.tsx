import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BookFilterProps {
  categories: string[];
  countByCategory: Record<string, number>;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function BookFilter({ 
  categories, 
  countByCategory, 
  selectedCategory, 
  onCategorySelect 
}: BookFilterProps) {
  // 카테고리가 없을 경우
  if (!categories || categories.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        카테고리 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const totalCount = Object.values(countByCategory).reduce((sum, count) => sum + count, 0);

  return (
    <ScrollArea className="pr-4" style={{ scrollBehavior: 'smooth' }}>
      <div className="space-y-2 pt-1">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left font-normal py-3 px-4 rounded-lg transition-colors",
              selectedCategory === category ? "bg-primary/10 text-primary font-medium" : "hover:bg-primary/5"
            )}
            onClick={() => onCategorySelect(category)}
          >
            <span className="truncate">{category}</span>
            <span className={cn(
              "ml-auto", 
              selectedCategory === category ? "text-primary font-semibold" : "text-muted-foreground"
            )}>
              {category === '전체' ? totalCount : countByCategory[category] || 0}
            </span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
} 