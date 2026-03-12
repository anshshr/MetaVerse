import * as bcrypt from "bcrypt";
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export async function comparePassword(
  originalPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(originalPassword, hashedPassword);
}
