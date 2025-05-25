"use server";

import { User, UserZodSchema } from "app-types/user";
import { userRepository } from "lib/db/repository";
import { signIn } from "./auth";

import { safe } from "ts-safe";
import logger from "logger";
import { CacheKeys } from "lib/cache/cache-keys";
import { serverCache } from "lib/cache";

export async function existsByEmailAction(email: string) {
  const exists = await userRepository.existsByEmail(email);
  return exists;
}
export async function registerAction(
  user: Omit<User, "id"> & { plainPassword: string },
) {
  if (process.env.DISABLE_REGISTRATION === "true") {
    throw new Error("Registration is currently not supported.");
  }
  const createdUser = await userRepository.register(user);
  return createdUser;
}

export async function loginAction({
  email,
  password,
}: { email: string; password: string }) {
  return safe(async () => {
    const validated = UserZodSchema.pick({
      email: true,
      password: true,
    }).parse({ email, password });

    await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });
  })
    .ifFail((e) => {
      logger.error(e);
      throw new Error("Not found User");
    })
    .unwrap();
}

export const rememberUserAction = async (userId: string) => {
  const cacheKey = CacheKeys.user(userId);
  const cache = await serverCache.get<User>(cacheKey);
  if (cache) {
    return cache;
  }
  const user = await userRepository.findById(userId);
  if (!user) {
    return null;
  }
  await serverCache.set(cacheKey, user, 1000 * 60 * 60);
  return user;
};
