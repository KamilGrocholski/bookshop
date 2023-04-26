const BookCardSkeleton = () => {
  return (
    <div className="relative space-y-5 rounded-2xl bg-gray-900 bg-gradient-to-r from-transparent via-gray-600 to-transparent p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-900 before:to-transparent">
      <div className="h-32 rounded-lg bg-gray-600"></div>
      <div className="space-y-3">
        <div className="h-3 rounded-lg bg-gray-600"></div>
        <div className="h-3 rounded-lg bg-gray-600"></div>
        <div className="h-3 rounded-lg bg-gray-600"></div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
