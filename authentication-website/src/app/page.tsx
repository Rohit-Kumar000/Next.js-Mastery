import { redirect } from "next/navigation";

// The proxy sends guests to /login, logged-in users continue to /profile
export default function Home() {
  redirect("/profile");
}
