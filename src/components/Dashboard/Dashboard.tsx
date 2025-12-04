import { useEffect, useState } from 'react';
import { Heart, Target, TrendingUp, Loader, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type Donation = Database['public']['Tables']['donations']['Row'] & {
  projects?: { title: string } | null;
};

interface DashboardProps {
  onEditProject: (projectId: string) => void;
  onViewProject: (projectId: string) => void;
}

export function Dashboard({ onEditProject, onViewProject }: DashboardProps) {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRaised: 0, projectCount: 0, donationCount: 0 });

  useEffect(() => {
    if (profile?.role === 'project_creator' || profile?.role === 'admin') {
      loadCreatorData();
    } else {
      loadDonorData();
    }
  }, [profile]);

  const loadCreatorData = async () => {
    setLoading(true);
    try {
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('creator_id', profile?.id)
        .order('created_at', { ascending: false });

      if (projectData) {
        setProjects(projectData);
        const totalRaised = projectData.reduce((sum, p) => sum + p.raised_amount, 0);
        setStats({
          totalRaised,
          projectCount: projectData.length,
          donationCount: 0,
        });
      }
    } catch (error) {
      console.error('Error loading creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDonorData = async () => {
    setLoading(true);
    try {
      const { data: donationData } = await supabase
        .from('donations')
        .select(`
          *,
          projects (title)
        `)
        .eq('donor_id', profile?.id)
        .order('created_at', { ascending: false });

      if (donationData) {
        setDonations(donationData);
        const totalDonated = donationData
          .filter((d) => d.status === 'completed')
          .reduce((sum, d) => sum + d.amount, 0);
        setStats({
          totalRaised: totalDonated,
          projectCount: 0,
          donationCount: donationData.length,
        });
      }
    } catch (error) {
      console.error('Error loading donor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      fully_funded: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-600',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const isCreator = profile?.role === 'project_creator' || profile?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          {isCreator ? 'Manage your projects and track performance' : 'View your donation history and impact'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${stats.totalRaised.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            {isCreator ? 'Total Raised' : 'Total Donated'}
          </div>
        </div>

        {isCreator ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.projectCount}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.donationCount}</div>
            <div className="text-sm text-gray-600">Projects Supported</div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {profile?.is_verified ? 'Verified' : 'Pending'}
          </div>
          <div className="text-sm text-gray-600">Account Status</div>
        </div>
      </div>

      {isCreator && projects.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => {
              const progress = (project.raised_amount / project.goal_amount) * 100;
              return (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3
                          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-emerald-600"
                          onClick={() => onViewProject(project.id)}
                        >
                          {project.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                    </div>
                    <button
                      onClick={() => onEditProject(project.id)}
                      className="ml-4 p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        ${project.raised_amount.toLocaleString()} of ${project.goal_amount.toLocaleString()}
                      </span>
                      <span className="text-emerald-600 font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isCreator && donations.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Donations</h2>
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between py-4 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{donation.projects?.title || 'Project'}</h3>
                  <p className="text-sm text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-600">${donation.amount.toLocaleString()}</div>
                  <div className={`text-xs ${donation.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {donation.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {((isCreator && projects.length === 0) || (!isCreator && donations.length === 0)) && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isCreator ? 'No projects yet' : 'No donations yet'}
            </h3>
            <p className="text-gray-600">
              {isCreator
                ? 'Create your first project to start raising funds for poverty alleviation initiatives.'
                : 'Support a project today and start making a difference in the fight against poverty.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
