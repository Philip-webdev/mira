import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthNavbar() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div>
        <h1 className="text-xl font-black text-[rgb(24,11,40)]"><a href='/splash' style={{textDecoration: 'none'}}><b><div className="flex gap-0" ><img className='w-8 h-6' src="/mira-removebg-preview.png" /><div className="mt-1">mira</div></div></b></a></h1>
      </div>

      <nav className="hidden lg:flex gap-16 text-sm text-gray-600 font-medium">
        <Link className="hover:text-[rgb(4,173,183)] transition-colors duration-300" to="/">
          Home
        </Link>

        <Link className="hover:text-[rgb(4,173,183)] transition-colors duration-300" to="/">
          About
        </Link>

        <Link className="hover:text-[rgb(4,173,183)] transition-colors duration-300" to="/">
          Support
        </Link>

        <Link className="hover:text-[rgb(4,173,183)] transition-colors duration-300" to="/">
          Contact
        </Link>
      </nav>

      <div className="hidden lg:flex items-center justify-content gap-8">
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
        >
          <Link
            to="/login"
            className="group relative inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[rgb(4,173,183)] transition-colors duration-300"
          >
            <span>Login</span>
            <span className="absolute bottom-1 left-3 h-0.5 w-[calc(100%-1.5rem)] scale-x-0 rounded-full bg-[rgb(4,173,183)] transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
        >
          <Link
            to="/signup"
            className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[rgb(4,173,183)] transition-all duration-300 hover:bg-[rgb(4,173,183)] hover:text-white hover:shadow-lg"
          >
            Register
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
