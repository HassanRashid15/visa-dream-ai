import React from 'react';
import { cn } from '@/lib/utils';
import { useViewport } from '@/hooks/usePerformanceOptimization';

// Mobile-optimized container
interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className,
  fullWidth = false,
}) => {
  const { isMobile, isTablet } = useViewport();

  return (
    <div
      className={cn(
        'w-full',
        {
          'px-4': isMobile,
          'px-6': isTablet,
          'px-8': !isMobile && !isTablet,
          'max-w-full': fullWidth,
          'max-w-7xl mx-auto': !fullWidth,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

// Mobile-optimized grid
interface MobileGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 'gap-4', tablet: 'gap-6', desktop: 'gap-8' },
}) => {
  const { isMobile, isTablet } = useViewport();

  const gridCols = isMobile 
    ? cols.mobile || 1 
    : isTablet 
    ? cols.tablet || 2 
    : cols.desktop || 3;

  const gridGap = isMobile 
    ? gap.mobile || 'gap-4'
    : isTablet 
    ? gap.tablet || 'gap-6'
    : gap.desktop || 'gap-8';

  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${gridCols}`,
        gridGap,
        className
      )}
    >
      {children}
    </div>
  );
};

// Mobile-optimized card
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  compact?: boolean;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  hover = false,
  compact = false,
}) => {
  const { isMobile } = useViewport();

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        {
          'p-4': compact && isMobile,
          'p-6': !compact || !isMobile,
          'hover:shadow-md transition-shadow duration-200': hover,
          'hover:scale-[1.02] transition-transform duration-200': hover && !isMobile,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

// Mobile-optimized button
interface MobileButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  className,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
}) => {
  const { isMobile } = useViewport();

  const baseClasses = cn(
    'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      'px-3 py-2 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
      'w-full': fullWidth,
      'w-auto': !fullWidth,
      'min-h-[44px]': isMobile, // Minimum touch target
    },
    className
  );

  const variantClasses = cn({
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
    'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': variant === 'secondary',
    'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500': variant === 'outline',
    'opacity-50 cursor-not-allowed': disabled || loading,
  });

  return (
    <button
      className={cn(baseClasses, variantClasses)}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {children}
    </button>
  );
};

// Mobile-optimized text
interface MobileTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted';
  responsive?: boolean;
}

export const MobileText: React.FC<MobileTextProps> = ({
  children,
  className,
  size = 'md',
  weight = 'normal',
  color = 'primary',
  responsive = true,
}) => {
  const { isMobile, isTablet } = useViewport();

  const getSizeClasses = () => {
    if (!responsive) {
      switch (size) {
        case 'xs': return 'text-xs';
        case 'sm': return 'text-sm';
        case 'md': return 'text-base';
        case 'lg': return 'text-lg';
        case 'xl': return 'text-xl';
        default: return 'text-base';
      }
    }

    if (isMobile) {
      switch (size) {
        case 'xs': return 'text-xs';
        case 'sm': return 'text-sm';
        case 'md': return 'text-base';
        case 'lg': return 'text-lg';
        case 'xl': return 'text-xl';
        default: return 'text-base';
      }
    } else if (isTablet) {
      switch (size) {
        case 'xs': return 'text-sm';
        case 'sm': return 'text-base';
        case 'md': return 'text-lg';
        case 'lg': return 'text-xl';
        case 'xl': return 'text-2xl';
        default: return 'text-lg';
      }
    } else {
      switch (size) {
        case 'xs': return 'text-sm';
        case 'sm': return 'text-base';
        case 'md': return 'text-lg';
        case 'lg': return 'text-xl';
        case 'xl': return 'text-2xl';
        default: return 'text-lg';
      }
    }
  };

  const getWeightClasses = () => {
    switch (weight) {
      case 'normal': return 'font-normal';
      case 'medium': return 'font-medium';
      case 'semibold': return 'font-semibold';
      case 'bold': return 'font-bold';
      default: return 'font-normal';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary': return 'text-gray-900';
      case 'secondary': return 'text-gray-600';
      case 'muted': return 'text-gray-500';
      default: return 'text-gray-900';
    }
  };

  return (
    <span className={cn(getSizeClasses(), getWeightClasses(), getColorClasses(), className)}>
      {children}
    </span>
  );
};

// Mobile-optimized navigation
interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  children,
  className,
  sticky = false,
}) => {
  const { isMobile } = useViewport();

  return (
    <nav
      className={cn(
        'bg-white border-b border-gray-200',
        {
          'sticky top-0 z-50': sticky,
          'py-2': isMobile,
          'py-4': !isMobile,
        },
        className
      )}
    >
      <MobileContainer>
        <div className={cn('flex items-center justify-between', { 'flex-col': isMobile })}>
          {children}
        </div>
      </MobileContainer>
    </nav>
  );
};

// Mobile-optimized sidebar
interface MobileSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  children,
  isOpen,
  onClose,
  position = 'left',
}) => {
  const { isMobile } = useViewport();

  if (!isMobile) {
    return <div className="w-64 bg-white border-r border-gray-200">{children}</div>;
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
          {
            'left-0': position === 'left',
            'right-0': position === 'right',
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen && position === 'left',
            'translate-x-full': !isOpen && position === 'right',
          }
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

// Mobile-optimized form
interface MobileFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export const MobileForm: React.FC<MobileFormProps> = ({
  children,
  className,
  onSubmit,
}) => {
  const { isMobile } = useViewport();

  return (
    <form
      onSubmit={onSubmit}
      className={cn('space-y-4', { 'space-y-6': !isMobile }, className)}
    >
      {children}
    </form>
  );
};

// Mobile-optimized input
interface MobileInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  className,
}) => {
  const { isMobile } = useViewport();

  return (
    <div className={cn('space-y-2', { 'space-y-3': !isMobile })}>
      {label && (
        <label className={cn('block text-sm font-medium text-gray-700', { 'text-base': !isMobile })}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          {
            'py-3': isMobile,
            'text-base': isMobile,
            'text-sm': !isMobile,
          },
          error ? 'border-red-500 focus:ring-red-500' : '',
          disabled ? 'bg-gray-100 cursor-not-allowed' : '',
          className
        )}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized accordion
interface MobileAccordionProps {
  items: Array<{
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export const MobileAccordion: React.FC<MobileAccordionProps> = ({
  items,
  className,
}) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const { isMobile } = useViewport();

  return (
    <div className={cn('space-y-2', { 'space-y-3': !isMobile }, className)}>
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className={cn(
              'w-full px-4 py-3 flex items-center justify-between text-left',
              { 'px-6 py-4': !isMobile }
            )}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className={cn('font-medium', { 'text-lg': !isMobile })}>
                {item.title}
              </span>
            </div>
            <svg
              className={cn(
                'w-5 h-5 text-gray-400 transform transition-transform',
                openIndex === index ? 'rotate-180' : ''
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className={cn('px-4 pb-3', { 'px-6 pb-4': !isMobile })}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
