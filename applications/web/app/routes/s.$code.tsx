import { redirect } from "react-router";
import type { Route } from "./+types/s.$code";
import { findActiveUrlByCode } from "@url-shortener/engine";

export async function loader({ params }: Route.LoaderArgs) {
  const { code } = params;

  const shortened = await findActiveUrlByCode(code);

  if (!shortened) {
    throw new Response("Not Found", { status: 404 });
  }

  return redirect(shortened.originalUrl);
}
