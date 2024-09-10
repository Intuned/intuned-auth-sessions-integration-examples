import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { genSaltSync, hashSync } from "bcrypt-ts";

export async function getUser(email: string) {
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}
