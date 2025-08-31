import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { SignJWT, jwtVerify } from "jose";

// JWT Secret (use environment variable in production)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-here"
);

// Email verification token expiry (24 hours)
const VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Generate verification token
export function generateVerificationToken(): string {
  return randomUUID();
}

// Create JWT token
export async function createJWT(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

// Check if user exists by email
export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return result[0] || null;
}

// Create new user
export async function createUser(email: string) {
  const userId = randomUUID();
  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date(Date.now() + VERIFICATION_EXPIRY);

  const newUser = await db.insert(users).values({
    id: userId,
    email: email.toLowerCase(),
    emailVerified: false,
    verificationToken,
    verificationExpires,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { userId, verificationToken };
}

// Verify user email
export async function verifyUserEmail(token: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.verificationToken, token))
    .limit(1);

  if (!user[0]) {
    return { success: false, error: "Invalid verification token" };
  }

  if (user[0].verificationExpires && new Date() > user[0].verificationExpires) {
    return { success: false, error: "Verification token expired" };
  }

  await db
    .update(users)
    .set({
      emailVerified: true,
      verificationToken: null,
      verificationExpires: null,
      lastSignIn: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user[0].id));

  return { success: true, user: user[0] };
}

// Update user's last sign in
export async function updateLastSignIn(userId: string) {
  await db
    .update(users)
    .set({
      lastSignIn: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

// Generate signin verification token
export async function generateSigninToken(email: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date(Date.now() + VERIFICATION_EXPIRY);

  await db
    .update(users)
    .set({
      verificationToken,
      verificationExpires,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return { success: true, verificationToken };
}
