import { useEffect, useState } from 'react';
import {
  MapPin,
  Target,
  Calendar,
  Heart,
  Share2,
  Loader,
  MessageSquare,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'] & {
  categories?: { name: string; icon: string } | null;
  profiles?: { full_name: string; is_verified: boolean; bio: string } | null;
};

type Donation = Database['public']['Tables']['donations']['Row'] & {
  profiles?: { full_name: string } | null;
};

type ProjectUpdate = Database['public']['Tables']['project_updates']['Row'];

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
  onDonate: () => void;
}

export function ProjectDetail({ projectId, onBack, onDonate }: ProjectDetailProps) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
    loadDonations();
    loadUpdates();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          categories (name, icon),
          profiles (full_name, is_verified, bio)
        `)
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDonations = async () => {
    const { data } = await supabase
      .from('donations')
      .select(`
        *,
        profiles (full_name)
      `)
      .eq('project_id', projectId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setDonations(data);
  };

  const loadUpdates = async () => {
    const { data } = await supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (data) setUpdates(data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Project not found</p>
        <button
          onClick={onBack}
          className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  const progress = (project.raised_amount / project.goal_amount) * 100;
  const daysLeft = project.end_date
    ? Math.max(0, Math.ceil((new Date(project.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
      >
        ← Back to Projects
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-emerald-100 to-teal-100">
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Target className="h-24 w-24 text-emerald-600 opacity-50" />
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-center space-x-2 text-sm text-emerald-600 font-medium mb-3">
                {project.categories && <span>{project.categories.name}</span>}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
                {project.end_date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Ends {new Date(project.end_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
              </div>
            </div>
          </div>

          {updates.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Updates</h2>
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update.id} className="border-l-4 border-emerald-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{update.title}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(update.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{update.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {donations.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h2>
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {donation.is_anonymous ? 'Anonymous' : donation.profiles?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-600">${donation.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 space-y-6">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${project.raised_amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                raised of ${project.goal_amount.toLocaleString()} goal
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{progress.toFixed(0)}% funded</span>
                </div>
                {daysLeft !== null && (
                  <span>{daysLeft} days left</span>
                )}
              </div>
            </div>

            {user && project.status === 'active' && (
              <button
                onClick={onDonate}
                className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Support This Project</span>
              </button>
            )}

            <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>

            {project.profiles && (
              <div className="pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">Created by</h3>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-medium text-lg">
                      {project.profiles.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{project.profiles.full_name}</p>
                    {project.profiles.is_verified && (
                      <p className="text-sm text-emerald-600 mb-2">Verified Creator</p>
                    )}
                    {project.profiles.bio && (
                      <p className="text-sm text-gray-600">{project.profiles.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
