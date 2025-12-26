import { useState, useEffect } from "react";
import { resourceService } from "../services/resource.service";
import ResourceCard from "../features/resources/ResourceCard";
import { Search, Loader2 } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";

const Dashboard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  // Debounce search could be added here, but for now simple fetch
  useEffect(() => {
    loadResources();
  }, [searchTerm]); // Reload when search changes (basic implementation)

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await resourceService.getAll({
        search: searchTerm,
        page_size: 20,
      });
      setResources(data.resources || []);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Header & Greeting Section */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 shadow-2xl shadow-indigo-200">
          {/* Decorative background circle */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500 opacity-50" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-white">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Academic Resources
              </h1>
              <p className="mt-2 text-indigo-100 font-medium opacity-90">
                Welcome back, <span className="font-bold underline decoration-indigo-300 underline-offset-4">{user?.first_name}</span>. Ready to study?
              </p>
            </div>
  
            {/* Enhanced Search Bar */}
            <div className="relative w-full md:w-96 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 transition-colors group-focus-within:text-indigo-600"
                size={22}
              />
              <input
                type="text"
                placeholder="Search notes, slides, exams..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-indigo-200 backdrop-blur-md focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/20 outline-none transition-all shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
  
        {/* Content Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Recent Uploads</h2>
            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors">View All →</span>
          </div>
  
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
              <p className="text-slate-400 font-medium animate-pulse">Gathering resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="mx-auto h-12 w-12 text-slate-300 mb-4">
                 <Search size={48} />
              </div>
              <p className="text-slate-500 text-lg font-semibold">No resources found.</p>
              <p className="text-sm text-slate-400">Try searching for something else, like "Calculus" or "History".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((res) => (
                <div key={res.id} className="transition-transform duration-300 hover:-translate-y-2">
                  <ResourceCard resource={res} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
export default Dashboard;
