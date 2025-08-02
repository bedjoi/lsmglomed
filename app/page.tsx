import Image from "next/image";

export default function Home() {
  const x = 2;
  const y = 3;
  const sum = x + y;
  console.log(`The sum of ${x} and ${y} is ${sum}`);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 ">
      <h1>Welcome to Glomed Academia</h1>
      <Image
        src={"/hero.png"}
        alt="Hero Image"
        width={200}
        height={200}
        className="rounded-lg shadow-lg bg-amber-400 bg-cover bg-center"
      />
    </div>
  );
}
