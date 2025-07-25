import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { contractsApi, ratingsApi } from "../../api/request";

interface Contract {
  _id: string;
  job: {
    _id: string;
    title: string;
  };
  freelancer: {
    _id: string;
    name: string;
  };
}

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  onComplete: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  contract,
  onComplete,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || rating === 0) return;

    try {
      setLoading(true);
      setError(null);

      // Complete the contract
      await contractsApi.completeContract(contract._id);

      // Submit rating
      await ratingsApi.submitRating({
        jobId: contract.job._id,
        toUserId: contract.freelancer._id,
        rating,
        review,
      });

      onComplete();
      onClose();

      // Reset form
      setRating(0);
      setReview("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete contract"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    setError(null);
    onClose();
  };

  if (!isOpen || !contract) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Complete & Rate</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">
              Rate {contract.freelancer.name}'s work on "{contract.job.title}"
            </h3>

            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Review (optional)
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Share your experience working with this freelancer..."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {loading ? "Completing..." : "Complete & Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
