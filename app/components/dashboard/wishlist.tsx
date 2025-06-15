export function Wishlist({ wishlistItems }: { wishlistItems: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">My Wishlist</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistItems.map((item, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-lg bg-white hover:shadow"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h4 className="font-medium text-gray-900">{item.name}</h4>
            <p className="text-sm text-gray-600">
              Rp {item.price.toLocaleString("id-ID")}{" "}
              <span className="line-through text-gray-400">
                {item.originalPrice > item.price &&
                  `Rp ${item.originalPrice.toLocaleString("id-ID")}`}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
