export function PasswordRequirements() {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/40 p-3.5">
      <p className="text-xs font-medium text-foreground">Password requirements</p>

      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        <li>• At least 8 characters</li>
        <li>• One uppercase letter</li>
        <li>• One lowercase letter</li>
        <li>• One number</li>
        <li>• One special character</li>
      </ul>
    </div>
  );
}
