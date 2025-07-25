import { Link } from "react-router";
import { Dumbbell } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center justify-center gap-2">
      <div className="h-12 w-12 bg-blue-800 rounded-full p-2.5">
        <Dumbbell className="h-full w-full text-white" />
      </div>
      <h1 className="text-3xl font-semibold">
        Neuro
        <span className="text-blue-600">Fit.</span>
      </h1>
    </Link>
  );
};

export default Logo;
