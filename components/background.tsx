import Image from "next/image";

export function Background() {
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden -z-10 bg-[#000004]">
      <Image
        alt="Night sky"
        src="/sky2.jpg"
        quality={100}
        draggable="false"
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
}
