import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { Hero } from './components/Home/Hero';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { ProjectList } from './components/Projects/ProjectList';
import { ProjectDetail } from './components/Projects/ProjectDetail';
import { CreateProject } from './components/Projects/CreateProject';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AdminPanel } from './components/Admin/AdminPanel';
import { DonationModal } from './components/Donation/DonationModal';
import { Loader } from 'lucide-react';

type Page = 'home' | 'signin' | 'signup' | 'projects' | 'project-detail' | 'create' | 'edit' | 'dashboard' | 'admin';

function AppContent() {
  const { loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationProject, setDonationProject] = useState<{ id: string; title: string } | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedProjectId(null);
    setEditProjectId(null);
    window.scrollTo(0, 0);
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project-detail');
    window.scrollTo(0, 0);
  };

  const handleEditProject = (projectId: string) => {
    setEditProjectId(projectId);
    setCurrentPage('edit');
    window.scrollTo(0, 0);
  };

  const handleDonate = (projectId: string, projectTitle: string) => {
    setDonationProject({ id: projectId, title: projectTitle });
    setShowDonationModal(true);
  };

  const handleDonationSuccess = () => {
    if (selectedProjectId) {
      setCurrentPage('project-detail');
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage('home');
      setSelectedProjectId(null);
      setEditProjectId(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Hope Bridge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      <main>
        {currentPage === 'home' && (
          <>
            <Hero
              onGetStarted={() => handleNavigate('signup')}
              onExplore={() => handleNavigate('projects')}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Projects</h2>
                <p className="text-gray-600">Support verified projects making real impact</p>
              </div>
              <ProjectList
                onProjectClick={handleProjectClick}
                filterStatus={['active', 'fully_funded']}
              />
            </div>
          </>
        )}

        {currentPage === 'signin' && <SignIn onNavigate={handleNavigate} />}

        {currentPage === 'signup' && <SignUp onNavigate={handleNavigate} />}

        {currentPage === 'projects' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Projects</h1>
              <p className="text-gray-600">Discover and support poverty alleviation initiatives</p>
            </div>
            <ProjectList
              onProjectClick={handleProjectClick}
              filterStatus={['active', 'fully_funded', 'completed']}
            />
          </div>
        )}

        {currentPage === 'project-detail' && selectedProjectId && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <ProjectDetail
              projectId={selectedProjectId}
              onBack={() => handleNavigate('projects')}
              onDonate={() => {
                const projectTitle = document.title;
                handleDonate(selectedProjectId, projectTitle);
              }}
            />
          </div>
        )}

        {currentPage === 'create' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <CreateProject onSuccess={() => handleNavigate('dashboard')} />
          </div>
        )}

        {currentPage === 'edit' && editProjectId && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <CreateProject
              projectId={editProjectId}
              onSuccess={() => handleNavigate('dashboard')}
            />
          </div>
        )}

        {currentPage === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Dashboard
              onEditProject={handleEditProject}
              onViewProject={handleProjectClick}
            />
          </div>
        )}

        {currentPage === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <AdminPanel onViewProject={handleProjectClick} />
          </div>
        )}
      </main>

      {showDonationModal && donationProject && (
        <DonationModal
          projectId={donationProject.id}
          projectTitle={donationProject.title}
          onClose={() => setShowDonationModal(false)}
          onSuccess={handleDonationSuccess}
        />
      )}

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Hope Bridge</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Connecting communities through transparent crowdfunding for poverty alleviation
                projects worldwide.
              </p>
              <p className="text-sm text-gray-500">
                Built for social impact. All projects are verified and monitored for transparency.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <button onClick={() => handleNavigate('projects')} className="hover:text-emerald-600">
                    Browse Projects
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('signup')} className="hover:text-emerald-600">
                    Start a Project
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-600">How It Works</button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <button className="hover:text-emerald-600">Terms of Service</button>
                </li>
                <li>
                  <button className="hover:text-emerald-600">Privacy Policy</button>
                </li>
                <li>
                  <button className="hover:text-emerald-600">Contact Us</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 Hope Bridge. Built for educational purposes as a final project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
