import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Violet Storm Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
        }}
      />

      {/* Your Content/Components */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
        <img
          src="ErrorNotFound.png"
          alt="not found"
          className="max-w-60  mb-6 w-96 animate-fade-in hover:scale-102 active:scale-98"
        ></img>

        <p className="text-xl text-slate-200 font-semibold">
          Vùng không khả dụng, mời về Trang chủ
        </p>

        <Link
          to="/"
          className="flex items-center gap-1 px-6 py-3 mt-6 font-medium text-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark hover:shadow-glow"
        >
          <Home className="size-3.5" />
          Trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
