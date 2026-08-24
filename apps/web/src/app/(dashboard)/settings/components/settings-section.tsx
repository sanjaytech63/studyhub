import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsSectionProps {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
      <CardHeader className="border-b border-border/70 px-5 py-5 sm:px-6">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="mt-1 text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
