import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed | JCM",
  description: "Feed page of my portfolio where my projects posts can be seen.",
};

export default function Home() {
  return (
    <div>
      <Button>Click Me</Button>

      <div className="flex items-center gap-2">
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-50"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-100"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-200"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-300"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-400"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-500"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-600"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-700"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-800"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-900"></div>
        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-primary-950"></div>

        <div className="min-w-32 max-w-32 min-h-32 max-h-32 rounded-lg bg-dark border border-red-50"></div>
      </div>
    </div>
  );
}
