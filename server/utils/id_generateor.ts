export function generateId(prefix?: string) {
  const allowed = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");
  let header = "";
  for (let i = 0; i < 32; i++) {
    header += allowed[Math.floor(Math.random() * allowed.length)];
  }
  return Date.now() + "-" + header + "-" + prefix;
}
