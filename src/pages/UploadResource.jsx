import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, File, X, Loader2, CheckCircle2, Tag, Globe, BookOpen } from "lucide-react";

const UploadResource = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "notes",
    sharing_level: "public",
    tags: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    // MOCK SUCCESS for Demo purposes
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/app");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Upload Resource</h1>
        <p className="text-slate-500 mt-2 font-medium">Share your materials with the university community.</p>
      </div>

      {success ? (
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Upload Successful!</h2>
          <p className="text-slate-500 mt-2 font-medium">Your contribution is now live.</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Improved File Drop Zone */}
            <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all relative group cursor-pointer ${file ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}>
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.ppt,.pptx" />
              {!file ? (
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform"><UploadCloud size={32} /></div>
                  <span className="text-slate-900 font-bold text-lg">Click to upload or drag & drop</span>
                  <span className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">PDF, DOC, PPT up to 100MB</span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><File size={24} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[250px]">{file.name}</p>
                      <p className="text-xs text-indigo-500 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors z-20"><X size={20} /></button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Resource Title</label>
                <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="e.g. Calculus I - Midterm Review" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Description</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" rows="3" placeholder="Briefly explain what's in this resource..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              {/* Grid for Type and Sharing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block flex items-center gap-2"><BookOpen size={14}/> Resource Type</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 appearance-none cursor-pointer" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="notes">Lecture Notes</option>
                    <option value="slides">Presentation Slides</option>
                    <option value="assignment">Assignment / HW</option>
                    <option value="exam">Exam Paper</option>
                    <option value="textbook">Textbook</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block flex items-center gap-2"><Globe size={14}/> Sharing Level</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 appearance-none cursor-pointer" value={formData.sharing_level} onChange={(e) => setFormData({...formData, sharing_level: e.target.value})}>
                    <option value="public">Public (Everyone)</option>
                    <option value="university">My University Only</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block flex items-center gap-2"><Tag size={14}/> Tags (Optional)</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="math, calculus, finals" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={loading || !file} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 transition-all hover:-translate-y-0.5">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
              {loading ? "Processing..." : "Publish Resource"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UploadResource;