import * as React from "react";
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id?: string;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    register?: UseFormRegister<FieldValues>;
    errors?: FieldValues;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ 
        id, 
        label, 
        type = 'text', 
        disabled, 
        required, 
        register, 
        errors, 
        className, 
        ...props 
    }, ref) => {

        const isError = id && errors && errors[id];

        return (
            <div className={`w-full relative ${className}`}>
                <input 
                    id={id}
                    disabled={disabled}
                    {...(register && id ? register(id, { required }) : {})}
                    placeholder=" "
                    type={type}
                    ref={ref}
                    className={cn(
                        `peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                        ${isError ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'} 
                        flex h-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,
                        className
                    )}
                    {...props}
                />
                {label && (
                    <label
                        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4
                        ${isError ? 'text-red-500' : 'text-zinc-400'}`}
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Input.displayName = "CombinedInput";

export { Input };
