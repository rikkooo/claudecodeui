import { Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';

type ThemeValue = 'light' | 'dark' | 'cyberpunk';

type Option = {
  value: ThemeValue;
  label: string;
  Icon: typeof Sun;
};

const OPTIONS: Option[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'cyberpunk', label: 'Cyberpunk', Icon: Zap },
];

type Props = {
  ariaLabel?: string;
};

export default function ThemeSelector({ ariaLabel = 'Select theme' }: Props) {
  const { theme, setTheme } = useTheme() as {
    theme: ThemeValue;
    setTheme: (next: ThemeValue) => void;
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 p-1"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
