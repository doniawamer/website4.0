export const CONTACT_EMAIL = "doniawamer@gmail.com";

export function buildMailto(email: string = CONTACT_EMAIL): string {
  const subject = encodeURIComponent("Hi from your site \uD83C\uDF38");
  const body = encodeURIComponent("Hey Donia,\n\n");
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
