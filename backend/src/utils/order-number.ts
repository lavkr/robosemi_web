export function generateOrderNumber(): string {
  const timestampPart = Date.now().toString().slice(-6);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RBS${timestampPart}${randomPart}`;
}
