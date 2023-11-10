import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;
}
const PrimaryButton: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small, 
    icon: Icon,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative disabled:opacity-70 disabled:cursor-not-allowed capitalize rounded-lg hover:opacity-80 transition w-full
			${outline ? 'bg-white' : 'bg-rose-500'}
			${outline ? 'border-black' : 'border-rose-500'}
			${outline ? 'text-black' : 'text-white'}
			${small ? 'py-1' : 'py-3'}
			${small ? 'text-sm' : 'text-md'}
			${small ? 'font-light' : 'font-semibold'} 
			${small ? 'border-[1px]' : 'border-2'}
			`}
        >
            {Icon && <Icon size={24} className="absolute left-4 top3" />}
            {label}
        </button>
    );
};

export { PrimaryButton };

// Button.jsx

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
