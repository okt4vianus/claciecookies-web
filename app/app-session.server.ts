import { createCookieSessionStorage } from "react-router";
import type { User } from "@/modules/user/type";

type AppSessionData = {
  userId: string;
  user: User;
  toastMessage?: string;
};

type AppSessionFlashData = {
  error: string;
};

const {
  getSession: getAppSession,
  commitSession: commitAppSession,
  destroySession: destroyAppSession,
} = createCookieSessionStorage<AppSessionData, AppSessionFlashData>({
  cookie: {
    name: "__clacie_app_session",

    httpOnly: true,
    maxAge: 604800, // 7 days
    path: "/",
    sameSite: "lax",
    secrets: [String(process.env.SESSION_SECRET_COOKIE)],
    secure: true,
  },
});

export { getAppSession, commitAppSession, destroyAppSession };
