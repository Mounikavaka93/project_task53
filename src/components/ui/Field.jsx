export function Field({ id, label, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5" data-invalid={error ? "true" : undefined}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-clay">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({ id, label, error, hint, className = "", ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field ${className}`}
        {...props}
      />
    </Field>
  );
}
