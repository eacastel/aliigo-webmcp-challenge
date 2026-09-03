import Image from "next/image";

export function BrandMark() {
  return <Image className="brand-logo" src="/brand/aliigo-logo-green.svg" alt="Aliigo" width={112} height={48} priority />;
}
