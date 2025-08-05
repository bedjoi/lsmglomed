import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 ">
      <UserButton   />
    </div>
  );
}
