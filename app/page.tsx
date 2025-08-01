import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1>Welcome to Glomed Academia</h1>
      <Image
        src="/images/hero.jpg"
        alt="Hero Image"
        width={500}
        height={300}
      />
    </div>
  );
}
