import { MapPin, Target, TrendingUp, Calendar } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'] & {
  categories?: { name: string; icon: string } | null;
  profiles?: { full_name: string; is_verified: boolean } | null;
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const progress = (project.raised_amount / project.goal_amount) * 100;
  const daysLeft = project.end_date
    ? Math.max(0, Math.ceil((new Date(project.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    fully_funded: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Target className="h-16 w-16 text-emerald-600 opacity-50" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
            {project.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          {project.categories && (
            <span className="text-emerald-600 font-medium">{project.categories.name}</span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <MapPin className="h-4 w-4" />
          <span>{project.location}</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-gray-900">
                ${project.raised_amount.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">
                of ${project.goal_amount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>{progress.toFixed(0)}% funded</span>
            </div>
            {daysLeft !== null && (
              <div className="flex items-center space-x-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{daysLeft} days left</span>
              </div>
            )}
          </div>
        </div>

        {project.profiles && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-medium text-sm">
                  {project.profiles.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{project.profiles.full_name}</p>
                {project.profiles.is_verified && (
                  <p className="text-xs text-emerald-600">Verified Creator</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
