import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ShieldCheck, ShoppingCart, Shield, ArrowRight, Leaf, Globe, Users, Sprout } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  const featureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.2)",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  const stats = [
    { value: "50K+", label: "Farmers" },
    { value: "₹100Cr+", label: "Transactions" },
    { value: "15+", label: "States" },
    { value: "98%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen w-full bg-center bg-cover bg-no-repeat flex flex-col items-center overflow-hidden relative">
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY
        }}
      />
      
      {/* Hero Section */}
      <motion.div 
        className="w-full flex items-center justify-center min-h-screen px-4 py-20 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="max-w-6xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-emerald-300 border border-emerald-500/30">
              A Quotus Innovation
            </span>
          </motion.div>

          <motion.h1 
            className="text-6xl sm:text-7xl font-bold mb-6 text-white"
            variants={itemVariants}
          >
            <span className="inline-block bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 text-transparent bg-clip-text">Naturopura</span>
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-white/90 mb-6 font-light"
            variants={itemVariants}
          >
            Empowering Farmers Through
            <span className="text-emerald-400 font-medium"> Digital Innovation</span>
          </motion.p>
          
          <motion.p 
            className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            A revolutionary platform connecting farmers with technology, resources, and markets for sustainable agriculture
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/login" 
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-300 text-lg shadow-lg flex items-center justify-center group"
              >
                Login to Account
                <ArrowRight className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/register" 
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl transition-all duration-300 text-lg border border-white/30 shadow-lg flex items-center justify-center group"
              >
                Register Now
                <ArrowRight className="ml-2 w-5 h-5 opacity-0 transform transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                variants={itemVariants}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <h3 className="text-3xl font-bold text-emerald-400 mb-2">{stat.value}</h3>
                <p className="text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce p-2 bg-white/10 backdrop-blur-md rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="w-full bg-black/40 backdrop-blur-md py-20 px-4 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 text-transparent bg-clip-text">
              Why Choose Naturopura
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            {[
              {
                icon: <ShieldCheck size={42} className="text-emerald-400" />,
                title: "Identity Verification",
                description: "Secure digital onboarding with eKYC and blockchain-based verification"
              },
              {
                icon: <Leaf size={42} className="text-emerald-400" />,
                title: "Financial Services",
                description: "Access loans, insurance, and government subsidies seamlessly"
              },
              {
                icon: <ShoppingCart size={42} className="text-emerald-400" />,
                title: "Marketplace",
                description: "Direct buyer-seller connections with AI-based price recommendations"
              },
              {
                icon: <Sprout size={42} className="text-emerald-400" />,
                title: "Smart Farming",
                description: "IoT-powered monitoring and early warning systems"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 flex flex-col items-center text-center transition-all cursor-pointer"
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="rounded-2xl bg-white/5 p-4 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/register" 
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-300 text-lg shadow-lg inline-flex items-center group"
              >
                Join Naturopura Today
                <ArrowRight className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <motion.footer 
        className="w-full bg-black/60 backdrop-blur-md py-8 px-4 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/70">&copy; 2025 Naturopura by Quotus. Transforming agriculture through technology.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;