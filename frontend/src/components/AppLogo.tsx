interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 36, className = '' }: AppLogoProps) {
  return (
    <img
      src="/logo.svg"
      alt=""
      width={size}
      height={size}
      className={`app-logo ${className}`.trim()}
      aria-hidden
    />
  );
}
