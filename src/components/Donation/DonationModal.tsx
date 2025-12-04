import { useState } from 'react';
import { X, Heart, AlertCircle, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DonationModalProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DonationModal({ projectId, projectTitle, onClose, onSuccess }: DonationModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: donationError } = await supabase.from('donations').insert([
        {
          donor_id: user.id,
          project_id: projectId,
          amount: donationAmount,
          message,
          is_anonymous: isAnonymous,
          status: 'completed',
          transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        },
      ]);

      if (donationError) throw donationError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Support This Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Heart className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-900">You're supporting:</p>
                <p className="text-sm text-emerald-800 mt-1">{projectTitle}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleDonate} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className={`py-3 px-4 border-2 rounded-lg font-medium transition-colors ${
                      amount === preset.toString()
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 text-gray-700 hover:border-emerald-500'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="Custom amount"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Leave a message of support..."
              />
            </div>

            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Make this donation anonymous</p>
                  <p className="text-sm text-gray-600">
                    Your name will not be displayed publicly
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <p className="font-medium text-gray-900">Payment Information</p>
              </div>
              <p className="text-sm text-gray-600">
                This is a demo. In production, Stripe payment processing would be integrated here.
                Click "Donate Now" to simulate a successful donation.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Heart className="h-5 w-5" />
              <span>{loading ? 'Processing...' : 'Donate Now'}</span>
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-4">
            By donating, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}
