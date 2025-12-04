import { Heart, Target, Users, TrendingUp } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export function Hero({ onGetStarted, onExplore }: HeroProps) {
  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Heart className="h-12 w-12 text-emerald-600 animate-pulse" fill="currentColor" />
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">Hope Bridge</h1>
            </div>
            <p className="text-xl lg:text-2xl text-gray-700 mb-4 leading-relaxed">
              Connecting Communities Through Transparent Crowdfunding
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Empowering verified NGOs and individuals to fund poverty alleviation projects
              that create lasting change in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started Today
              </button>
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-emerald-600"
              >
                Explore Projects
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Projects</h3>
                <p className="text-gray-600">
                  Every project is carefully reviewed and verified for transparency and legitimacy
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community Impact</h3>
                <p className="text-gray-600">
                  Join thousands of donors making a real difference in fighting poverty
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Full Transparency</h3>
                <p className="text-gray-600">
                  Track every dollar with real-time updates and detailed progress reports
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
            Focus Areas for Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Education', color: 'bg-amber-100 text-amber-700' },
              { name: 'Healthcare', color: 'bg-red-100 text-red-700' },
              { name: 'Clean Water', color: 'bg-blue-100 text-blue-700' },
              { name: 'Food Security', color: 'bg-green-100 text-green-700' },
              { name: 'Housing', color: 'bg-indigo-100 text-indigo-700' },
              { name: 'Skills Training', color: 'bg-purple-100 text-purple-700' },
            ].map((category) => (
              <div
                key={category.name}
                className={`${category.color} rounded-lg p-4 text-center font-medium hover:shadow-md transition-shadow cursor-pointer`}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
