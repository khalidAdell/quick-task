// Home.tsx
import { motion } from "framer-motion";
import { FaSearch, FaCode, FaArrowRight } from "react-icons/fa";

// Animation configurations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const Home = () => {
  return (
    <div className="bg-[#f8f6f2] min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full min-h-[80vh] flex flex-col md:flex-row items-center justify-center bg-[#f8f6f2] px-6 md:px-16 py-10"
      >
        <motion.div
          variants={slideUp}
          className="max-w-xl text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Find & Post Small Freelance Tasks
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Connect with skilled freelancers and get your tasks done quickly and
            affordably.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-[#F4B860] hover:bg-[#e3a24f] text-white font-semibold rounded-lg transition"
          >
            Get Started
          </motion.button>
        </motion.div>
        <motion.div
          variants={slideUp}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 md:mt-0 md:ml-12"
        >
          <img
            src="/src/assets/images/illustration.jpg"
            alt="Freelancer Working"
            className="w-[400px]"
          />
        </motion.div>
      </motion.section>

      {/* Search Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto px-4 -mt-16 mb-16 z-10 relative"
      >
        <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center gap-4">
          <FaSearch className="text-gray-400 text-xl ml-4" />
          <input
            type="text"
            placeholder="Search for tasks (e.g., 'Fix WordPress bug', 'Logo design')"
            className="flex-1 p-3 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#F4B860] text-white px-6 py-3 rounded-lg hover:bg-[#e3a24f] transition"
          >
            Search
          </motion.button>
        </div>
      </motion.div>

      {/* Task Categories */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Popular Categories
        </h2>
        <motion.div
          variants={staggerChildren}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            "Web Development",
            "Graphic Design",
            "Content Writing",
            "Tech Support",
          ].map((cat) => (
            <motion.div
              key={cat}
              variants={slideUp}
              whileHover="hover"
              // variants={{ hover: { y: -5 } }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="bg-[#F4B860]/10 w-fit p-4 rounded-full mb-4">
                <FaCode className="text-[#F4B860] text-2xl" />
              </div>
              <h3 className="font-semibold mb-2">{cat}</h3>
              <p className="text-gray-500 text-sm">250+ tasks available</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Featured Tasks */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Tasks</h2>
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center text-[#F4B860] hover:text-[#e3a24f]"
          >
            See All <FaArrowRight className="ml-2" />
          </motion.button>
        </div>
        <motion.div
          variants={staggerChildren}
          className="grid md:grid-cols-3 gap-6"
        >
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              variants={slideUp}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">
                      Fix React Component Bug
                    </h3>
                    <p className="text-gray-500 text-sm">Web Development</p>
                  </div>
                  <span className="bg-[#F4B860]/10 text-[#F4B860] px-3 py-1 rounded-full text-sm">
                    $150
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Need immediate help fixing state management issue in React
                  app...
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#F4B860] text-white py-2 rounded-lg hover:bg-[#e3a24f] transition"
                >
                  View Task
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-white py-16 mb-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <motion.div
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-8"
          >
            {["Post Task", "Choose Freelancer", "Get It Done"].map(
              (step, index) => (
                <motion.div
                  key={step}
                  variants={slideUp}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 hover:bg-[#f8f6f2] rounded-xl transition"
                >
                  <div className="bg-[#F4B860]/10 w-fit p-4 rounded-full mx-auto mb-6">
                    <span className="text-2xl font-bold text-[#F4B860]">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step}</h3>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Success Stories</h2>
        <motion.div
          variants={staggerChildren}
          className="grid md:grid-cols-2 gap-8"
        >
          {[1, 2].map((item) => (
            <motion.div
              key={item}
              variants={slideUp}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-600 mb-6">
                "QuickTask helped me find quality developers within hours!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-gray-500 text-sm">Startup Founder</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Newsletter */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-[#F4B860]/10 py-16"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-gray-600 mb-8">
            Get weekly updates on new tasks and platform features
          </p>
          <motion.div
            variants={slideUp}
            className="max-w-md mx-auto flex gap-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-[#F4B860] outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#F4B860] text-white px-6 py-3 rounded-lg hover:bg-[#e3a24f] transition"
            >
              Subscribe
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
