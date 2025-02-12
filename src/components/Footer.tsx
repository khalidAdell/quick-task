import { FaRegSmile } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-[#F4B860] font-semibold mb-4">QuickTask</h3>
          <p className="text-gray-400">
            Making micro-work seamless since {new Date().getFullYear()}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            {["About", "Careers", "Blog"].map((item) => (
              <li key={item} className="hover:text-[#F4B860] transition">
                <a href={`/${item.toLowerCase()}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            {["Terms", "Privacy", "Security"].map((item) => (
              <li key={item} className="hover:text-[#F4B860] transition">
                <a href={`/${item.toLowerCase()}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <div className="flex gap-4 text-2xl text-gray-400">
            {[FaRegSmile, FaRegSmile, FaRegSmile].map((Icon, index) => (
              <Icon
                key={index}
                className="hover:text-[#F4B860] transition cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
