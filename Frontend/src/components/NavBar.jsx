import { useNavigate } from "react-router-dom";

const NavBar = ({ authUser }) => {
  const navigate = useNavigate();

  return (
    <nav className="px-6 py-3 bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 cursor-pointer"
        >
          NeoChat AI
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Your personal futuristic assistant — chat, calculate, and discover with an AI companion built for tomorrow.
        </p>
        {!authUser && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="text-sm px-4 py-2 rounded border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth?mode=signup")}
              className="text-sm px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;