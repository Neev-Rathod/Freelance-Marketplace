export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatBudget = (budget: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(budget);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800 border-green-200";
    case "in progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "accepted":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getRatingStars = (rating: number): string => {
  const stars = Math.round(rating);
  return "★".repeat(stars) + "☆".repeat(5 - stars);
};
