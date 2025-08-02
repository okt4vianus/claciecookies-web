import { createCookieSessionStorage } from "react-router";

type AppSessionData = {
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
    maxAge: 86400, // 1 day
    path: "/",
    sameSite: "lax",
    secrets: [String(process.env.SESSION_SECRET_COOKIE)],
    secure: true,
  },
});

export { getAppSession, commitAppSession, destroyAppSession };
