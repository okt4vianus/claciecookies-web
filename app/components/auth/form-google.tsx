import { Form } from "react-router";
import { Button } from "../ui/button";

export function FormGoogle() {
  return (
    <Form method="POST" action="/action/auth/google">
      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 transition-colors touch-manipulation py-2 px-4 rounded-md bg-white hover:bg-gray-50"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/2875/2875404.png"
          alt="Google"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium">Continue with Google</span>
      </Button>
    </Form>
  );
}
