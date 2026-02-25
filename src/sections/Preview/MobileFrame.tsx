// src/sections/Preview/MobileFrame.tsx
type Props = {
  children: React.ReactNode;
};

export default function MobileFrame({ children }: Props) {
  return (
    <div className="flex justify-center">
      {/* Outer phone shell */}
      <div className="relative bg-black rounded-[40px] border border-gray-700 shadow-2xl w-[390px] h-[844px]">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-10" />

        {/* Screen */}
        <div className="absolute inset-3 rounded-[32px] bg-black overflow-y-auto">
          {/* Safe area */}
          <div className="pt-8 px-4 pb-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}