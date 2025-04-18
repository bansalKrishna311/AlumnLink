import { motion } from "framer-motion";

const Doodles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large decorative circles */}
      <motion.div
        className="absolute w-64 h-64 rounded-full border-[3px] border-[#fe6019]/30"
        style={{ top: '-5%', right: '-5%' }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full border-[2px] border-[#fe6019]/20"
        style={{ bottom: '10%', left: '-5%' }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Prominent shapes */}
      <motion.div
        className="absolute w-32 h-32 bg-[#fe6019]/10 rounded-full blur-md"
        style={{ top: '20%', left: '10%' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-40 h-40 bg-[#fe6019]/5 rounded-full blur-lg"
        style={{ bottom: '15%', right: '15%' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Squiggly lines with increased opacity */}
      <svg className="absolute top-0 left-0 w-full h-full">
        <motion.path
          d="M0,100 Q50,0 100,100 T200,100 T300,100 T400,100"
          stroke="#fe6019"
          strokeWidth="2"
          strokeOpacity="0.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Floating dots with higher contrast */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-[#fe6019]/30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Additional decorative elements */}
      <motion.div
        className="absolute w-24 h-24 border-2 border-dashed border-[#fe6019]/20 rounded-full"
        style={{ top: '40%', right: '20%' }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Diagonal lines */}
      <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
        <motion.line
          x1="0"
          y1="64"
          x2="64"
          y2="0"
          stroke="#fe6019"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.line
          x1="32"
          y1="64"
          x2="96"
          y2="0"
          stroke="#fe6019"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.5,
            delay: 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Curved paths */}
      <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
        <motion.path
          d="M0,50 C50,0 100,100 150,50 S200,0 250,50"
          stroke="#fe6019"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
};

export default Doodles;