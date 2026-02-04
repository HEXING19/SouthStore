export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">SouthStore</h3>
          <p className="text-sm">Proudly South African. Providing quality tools and threads since 2024.</p>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li>Contact Us</li>
            <li>Shipping Policy</li>
            <li>Returns</li>
            <li>Track Order</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Accepted Payment</h3>
          <div className="flex space-x-2">
            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">VISA</div>
            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">MC</div>
            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">EFT</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
