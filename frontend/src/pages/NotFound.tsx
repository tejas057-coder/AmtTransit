import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-6">
      {/* Glow Background */}
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="text-center max-w-xl w-full z-10">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-red-500/10 p-6 rounded-full">
            <AlertCircle className="text-red-500 w-12 h-12" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-7xl font-extrabold text-white mb-4"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg mb-6"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate("/")}
          className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-2xl flex items-center gap-2 mx-auto text-base font-medium transition"
        >
          <Home size={18} />
          Go to Home
        </motion.button>
      </div>
    </div>
  );
};

export default NotFound;
