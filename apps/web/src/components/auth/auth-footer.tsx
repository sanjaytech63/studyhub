import Link from 'next/link';

interface AuthFooterProps {
  readonly message: string;
  readonly label: string;
  readonly href: string;
}

export function AuthFooter({ message, label, href }: AuthFooterProps) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {message}{' '}
      <Link href={href} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    </p>
  );
}
