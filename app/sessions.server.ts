import { createCookieSessionStorage } from "react-router";
import type { User } from "@/modules/user/type";

type SessionData = {
  token: string;
  userId: string;
  user: User;
  toastMessage?: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__clacie_session_cookie",

      httpOnly: true,
      maxAge: 604800, // 7 days
      path: "/",
      sameSite: "lax",
      secrets: [String(process.env.SESSION_SECRET_COOKIE)],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
