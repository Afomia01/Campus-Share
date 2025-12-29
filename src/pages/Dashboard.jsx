// import { useState, useEffect, useCallback } from "react";
// import { resourceService } from "../services/resource.service";
// import ResourceCard from "../features/resources/ResourceCard";
// import { Search, Loader2, X, Filter, SortAsc } from "lucide-react";
// import { useAuth } from "../features/auth/AuthContext";

// const Dashboard = () => {
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   // NEW: Filter States
//   const [selectedType, setSelectedType] = useState("");
//   const [sortBy, setSortBy] = useState("newest");

//   const { user } = useAuth();

//   // Debounce Logic
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       loadResources();
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm, selectedType, sortBy]); // Reload when any filter changes

//   const loadResources = async () => {
//     setLoading(true);
//     try {
//       // We pass the filters to the service
//       const params = {
//         search: searchTerm,
//         page_size: 20,
//         sort_by: sortBy,
//       };

//       // Only add type if it's not empty (default "All")
//       if (selectedType) {
//         params.type = selectedType;
//       }

//       const data = await resourceService.getAll(params);
//       setResources(data.resources || []);
//     } catch (error) {
//       console.error("Failed to load resources:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     setSelectedType("");
//     setSortBy("newest");
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//       {/* Header Section */}
//       <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 shadow-2xl shadow-indigo-200">
//         <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500 opacity-50" />

//         <div className="relative z-10 flex flex-col gap-6">
//           <div className="text-white">
//             <h1 className="text-3xl font-extrabold tracking-tight">
//               Academic Resources
//             </h1>
//             <p className="mt-2 text-indigo-100 font-medium opacity-90">
//               Welcome back, {user?.first_name}. Find exactly what you need.
//             </p>
//           </div>

//           {/* COMPREHENSIVE SEARCH BAR ROW */}
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* 1. Main Text Search */}
//             <div className="relative flex-1 group">
//               <Search
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 z-10"
//                 size={22}
//               />
//               <input
//                 type="text"
//                 placeholder="Search titles or descriptions..."
//                 className="w-full pl-12 pr-10 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 backdrop-blur-md focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/20 outline-none transition-all shadow-lg"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-200 hover:text-white"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>

//             {/* 2. Resource Type Filter */}
//             <div className="relative md:w-48">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-200">
//                 <Filter size={18} />
//               </div>
//               <select
//                 className="w-full pl-10 pr-8 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/20 outline-none transition-all"
//                 value={selectedType}
//                 onChange={(e) => setSelectedType(e.target.value)}
//               >
//                 <option value="" className="text-slate-900">
//                   All Types
//                 </option>
//                 <option value="notes" className="text-slate-900">
//                   Lecture Notes
//                 </option>
//                 <option value="slides" className="text-slate-900">
//                   Slides
//                 </option>
//                 <option value="exam" className="text-slate-900">
//                   Exam Papers
//                 </option>
//                 <option value="assignment" className="text-slate-900">
//                   Assignments
//                 </option>
//                 <option value="textbook" className="text-slate-900">
//                   Textbooks
//                 </option>
//               </select>
//             </div>

//             {/* 3. Sort Filter */}
//             <div className="relative md:w-48">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-200">
//                 <SortAsc size={18} />
//               </div>
//               <select
//                 className="w-full pl-10 pr-8 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/20 outline-none transition-all"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="newest" className="text-slate-900">
//                   Newest First
//                 </option>
//                 <option value="popular" className="text-slate-900">
//                   Most Popular
//                 </option>
//                 <option value="rating" className="text-slate-900">
//                   Highest Rated
//                 </option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Results Section */}
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold text-slate-800">
//             {searchTerm ? `Results for "${searchTerm}"` : "Recent Resources"}
//           </h2>
//           {/* Show active filters summary */}
//           {(selectedType || sortBy !== "newest") && (
//             <button
//               onClick={clearSearch}
//               className="text-sm text-indigo-600 hover:underline"
//             >
//               Clear Filters
//             </button>
//           )}
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-24 space-y-4">
//             <Loader2 className="animate-spin text-indigo-600" size={48} />
//             <p className="text-slate-400 font-medium">Loading resources...</p>
//           </div>
//         ) : resources.length === 0 ? (
//           <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//             <Search size={48} className="mx-auto text-slate-300 mb-4" />
//             <p className="text-slate-600 text-lg font-bold">
//               No resources found
//             </p>
//             <p className="text-sm text-slate-400">
//               Try adjusting your search terms or filters.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {resources.map((res) => (
//               <div
//                 key={res.id}
//                 className="transition-transform duration-300 hover:-translate-y-2"
//               >
//                 <ResourceCard resource={res} />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect } from "react";
import { resourceService } from "../services/resource.service";
import { socialService } from "../services/social.service"; // 1. Import Social Service
import ResourceCard from "../features/resources/ResourceCard";
import { Search, Loader2, X, Filter, SortAsc } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";

const Dashboard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // NEW: Store user's bookmark IDs locally
  const [bookmarkedIds, setBookmarkedIds] = useState(new Map());

  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { user } = useAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedType, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 2. Fetch Resources AND Bookmarks in parallel
      const params = {
        search: searchTerm,
        page_size: 20,
        sort_by: sortBy,
      };
      if (selectedType) params.type = selectedType;

      const [resourceData, bookmarkData] = await Promise.all([
        resourceService.getAll(params),
        socialService.getBookmarks(), // We need this to know what is bookmarked
      ]);

      const resList = resourceData.resources || [];

      // 3. Create a Map of { resource_id -> bookmark_id } for fast lookup
      // bookmarkData is usually [{ id: "b_id", resource: { id: "r_id" } }]
      const bMap = new Map();
      if (bookmarkData) {
        bookmarkData.forEach((b) => {
          // Map Resource ID to Bookmark ID
          bMap.set(b.resource.id, b.id);
        });
      }
      setBookmarkedIds(bMap);
      setResources(resList);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedType("");
    setSortBy("newest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 shadow-2xl shadow-indigo-200">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500 opacity-50" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="text-white">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Academic Resources
            </h1>
            <p className="mt-2 text-indigo-100 font-medium opacity-90">
              Welcome back, {user?.first_name}. Find exactly what you need.
            </p>
          </div>

          {/* COMPREHENSIVE SEARCH BAR ROW */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* 1. Main Text Search */}
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 z-10"
                size={22}
              />
              <input
                type="text"
                placeholder="Search titles or descriptions..."
                className="w-full pl-12 pr-10 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 backdrop-blur-md focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/20 outline-none transition-all shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-200 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* 2. Resource Type Filter */}
            <div className="relative md:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-200">
                <Filter size={18} />
              </div>
              <select
                className="w-full pl-10 pr-8 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/20 outline-none transition-all"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="" className="text-slate-900">
                  All Types
                </option>
                <option value="notes" className="text-slate-900">
                  Lecture Notes
                </option>
                <option value="slides" className="text-slate-900">
                  Slides
                </option>
                <option value="exam" className="text-slate-900">
                  Exam Papers
                </option>
                <option value="assignment" className="text-slate-900">
                  Assignments
                </option>
                <option value="textbook" className="text-slate-900">
                  Textbooks
                </option>
              </select>
            </div>

            {/* 3. Sort Filter */}
            <div className="relative md:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-200">
                <SortAsc size={18} />
              </div>
              <select
                className="w-full pl-10 pr-8 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/20 outline-none transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest" className="text-slate-900">
                  Newest First
                </option>
                <option value="popular" className="text-slate-900">
                  Most Popular
                </option>
                <option value="rating" className="text-slate-900">
                  Highest Rated
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {searchTerm ? `Results for "${searchTerm}"` : "Recent Resources"}
          </h2>
          {/* Show active filters summary */}
          {(selectedType || sortBy !== "newest") && (
            <button
              onClick={clearSearch}
              className="text-sm text-indigo-600 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-400 font-medium">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          // ... Empty State Code ...
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-600">No resources found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((res) => {
              // 4. CHECK IF BOOKMARKED
              const bookmarkId = bookmarkedIds.get(res.id);
              const isBookmarked = !!bookmarkId; // true if exists

              return (
                <div
                  key={res.id}
                  className="transition-transform duration-300 hover:-translate-y-2"
                >
                  <ResourceCard
                    resource={{
                      ...res,
                      // 5. INJECT STATE INTO CARD
                      is_bookmarked: isBookmarked,
                      bookmark_id: bookmarkId,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
