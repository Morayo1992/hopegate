import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader, Eye, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles?: { full_name: string; email?: string } | null;
  categories?: { name: string } | null;
};

interface AdminPanelProps {
  onViewProject: (projectId: string) => void;
}

export function AdminPanel({ onViewProject }: AdminPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    loadProjects();
  }, [activeTab]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles (full_name),
          categories (name)
        `)
        .order('created_at', { ascending: false });

      if (activeTab === 'pending') {
        query = query.eq('status', 'pending_review');
      }

      const { data, error } = await query;
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'active', start_date: new Date().toISOString() })
        .eq('id', projectId);

      if (error) throw error;
      loadProjects();
    } catch (error) {
      console.error('Error approving project:', error);
    }
  };

  const handleReject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'cancelled' })
        .eq('id', projectId);

      if (error) throw error;
      loadProjects();
    } catch (error) {
      console.error('Error rejecting project:', error);
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Review and manage projects</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-2 inline-flex space-x-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Projects
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'pending' ? 'No pending projects' : 'No projects yet'}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'pending'
              ? 'All projects have been reviewed.'
              : 'No projects have been created yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Goal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900 line-clamp-1">{project.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{project.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.profiles?.full_name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.categories?.name || 'Uncategorized'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${project.goal_amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${project.raised_amount.toLocaleString()} raised
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewProject(project.id)}
                          className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {project.status === 'pending_review' && (
                          <>
                            <button
                              onClick={() => handleApprove(project.id)}
                              className="p-2 text-green-600 hover:text-green-700 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(project.id)}
                              className="p-2 text-red-600 hover:text-red-700 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
