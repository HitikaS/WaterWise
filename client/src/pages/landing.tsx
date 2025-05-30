import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Droplets, Play, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Water Droplet */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.15 }}
        transition={{ duration: 2, type: "spring" }}
        className="absolute left-1/2 top-0 -translate-x-1/2 z-0"
      >
        <Droplets className="w-64 h-64 text-blue-400 drop-shadow-2xl" />
      </motion.div>

      {/* Header */}
      <header className="relative z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Droplets className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AQUAID
              </span>
            </div>
            <Button onClick={() => navigate("/profile")}
              className="px-6 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all backdrop-blur-md">
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-28 px-6 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-3xl mx-auto bg-white/60 dark:bg-gray-900/60 rounded-3xl shadow-2xl p-10 backdrop-blur-xl border border-blue-100 dark:border-gray-800"
        >
          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight drop-shadow-lg"
          >
            Predicting Water Scarcity,
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent"> Protecting Communities</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Advanced AI-powered water management system that combines weather forecasting, community reporting, and predictive analytics to help communities prepare for and prevent water scarcity events.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button onClick={() => navigate("/profile")}
              className="px-8 py-4 text-lg rounded-full font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-all backdrop-blur-md">
              Go to Profile
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl z-10 relative">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              icon: <Droplets className="h-10 w-10 text-white" />,
              title: "1. Water Monitoring",
              desc: "Track water levels and quality in real-time",
              bg: "from-blue-500 to-blue-600"
            }, {
              icon: <Play className="h-10 w-10 text-white" />,
              title: "2. Predictive Analytics",
              desc: "AI-powered predictions for water scarcity",
              bg: "from-green-500 to-green-600"
            }, {
              icon: <Shield className="h-10 w-10 text-white" />,
              title: "3. Early Warning",
              desc: "Send alerts and recommendations to help communities prepare",
              bg: "from-orange-500 to-orange-600"
            }].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * i, duration: 0.7 }}
                className="text-center bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 backdrop-blur-lg hover:scale-105 transition-transform"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${f.bg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {f.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50/80 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-700 backdrop-blur-md z-10 relative">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 AQUAID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}