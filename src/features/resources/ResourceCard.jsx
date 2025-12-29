import { useState } from "react";
import { FileText, Download, Eye, Clock, Bookmark, Star, User } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "../../services/resource.service";

const ResourceCard = ({ resource }) => {
  const [isBookmarked, setIsBookmarked] = useState(resource.is_bookmarked || false);

  const handleDownload = async () => {
    e.preventDefault(); // prevent link trigger
    try {
      const url = await resourceService.getDownloadUrl(resource.id);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download file");
    }
  };
  const handleBookmark = async (e) => {
    e.preventDefault(); 
    
    const originalState = isBookmarked;
    setIsBookmarked(!originalState);
  
    try {
      if (originalState) {
        // If it WAS bookmarked, delete it
        await resourceService.removeBookmark(resource.id);
        console.log("Bookmark removed");
      } else {
        // If it WAS NOT bookmarked, add it
        await resourceService.addBookmark(resource.id);
        console.log("Bookmark added");
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      // Step 2: Rollback UI if the server fails
      setIsBookmarked(originalState);
      alert("Check your connection. Bookmark sync failed.");
    }
  };
  const getIcon = (type) => {
    // Simple icon switching based on type
    return <FileText className="text-blue-600" size={24} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 relative group">
      
      {/* FIX FOR COMMENT #6: THE BOOKMARK BUTTON */}
      <button 
        onClick={handleBookmark}
        className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10"
      >
        <Bookmark 
          size={20} 
          className={`${isBookmarked ? "fill-indigo-600 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`} 
        />
      </button>

      <div className="flex justify-between items-start gap-3">
        {/* Updated icon color to Indigo for branding */}
        <div className="p-3 bg-indigo-50 rounded-lg shrink-0">
           <FileText className="text-indigo-600" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/app/resource/${resource.id}`} className="hover:underline">
            <h3 className="font-semibold text-gray-900 truncate pr-8" title={resource.title}>
              {resource.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
            {resource.description || "No description provided."}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {resource.tags?.slice(0, 3).map((t, index) => (
              <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">
                #{t.tag?.name || t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FIX FOR COMMENT #7: AUTHOR & RATING SECTION */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <User size={14} />
          <span className="text-xs font-medium">{resource.author_name || "Anonymous"}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star size={14} className="fill-current" />
          <span className="text-xs font-bold">{resource.average_rating || "0.0"}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5" title="Downloads">
            <Download size={14} /> {resource.download_count}
          </span>
          <span className="flex items-center gap-1.5" title="Views">
            <Eye size={14} /> {resource.view_count}
          </span>
        </div>
        <div className="flex items-center gap-1 font-medium">
          <Clock size={14} />
          <span>{new Date(resource.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-100"
      >
        <Download size={16} /> Download
      </button>
    </div>
  );
};
export default ResourceCard;
