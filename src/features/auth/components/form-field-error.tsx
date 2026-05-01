export function FormFieldError({ messages }: { messages: string[] | undefined }) {
  if (!messages?.length) return null;
  return <p className="text-destructive text-xs leading-tight">{messages.join(". ")}</p>;
}
