import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileOptimizedCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'minimal';
  onClick?: () => void;
}

const MobileOptimizedCard = ({ 
  title, 
  description, 
  children, 
  className, 
  variant = 'default',
  onClick 
}: MobileOptimizedCardProps) => {
  const cardVariants = {
    default: 'card-mobile',
    glow: 'card-glow',
    minimal: 'bg-transparent border-0 shadow-none p-0'
  };

  return (
    <Card 
      className={cn(
        cardVariants[variant],
        onClick && 'cursor-pointer active:scale-95',
        className
      )}
      onClick={onClick}
    >
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && (
            <CardTitle className="text-lg sm:text-xl md:text-2xl leading-tight">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-sm sm:text-base">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(title || description ? 'pt-0' : 'p-0')}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedCard;