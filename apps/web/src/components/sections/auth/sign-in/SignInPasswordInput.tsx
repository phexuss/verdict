'use client';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { EyeClosedLinear, EyeLinear } from '@solar-icons/react-perf';
import { forwardRef, useState } from 'react';

interface SignInPasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SignInPasswordInput = forwardRef<
  HTMLInputElement,
  SignInPasswordInputProps
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md flex relative">
      <Input
        ref={ref}
        className={`${className}`}
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        {...props}
      />
      <Button
        type="button"
        className="absolute right-0 top-0 text-accent-foreground bg-transparent hover:bg-transparent"
        size="icon"
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        {showPassword ? <EyeLinear /> : <EyeClosedLinear />}
      </Button>
    </div>
  );
});

SignInPasswordInput.displayName = 'SignInPasswordInput';

export default SignInPasswordInput;
