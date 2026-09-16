export const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 space-y-4 md:space-y-0">
        <div className="text-lg font-bold text-gray-900">Dealership</div>
        <div className="flex items-center">
          <span className="text-sm text-gray-400">
            Verified automotive service with blockchain technology
          </span>
        </div>
        <div className="flex space-x-6">
          <a
            href="/contact"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Contact Us
          </a>
          <a
            href="/service-terms"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Service Terms
          </a>
        </div>
      </div>
    </footer>
  );
};
