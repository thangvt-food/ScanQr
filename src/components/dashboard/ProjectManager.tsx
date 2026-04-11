"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink, QrCode, Settings, Database, MoreVertical, X, Share2 } from "lucide-react";
import { ProjectConfig, projectService } from "@/lib/projectService";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export const ProjectManager = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectConfig[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newProject, setNewProject] = useState({
    name: "",
    spreadsheetId: "",
    sheetName: "Sheet1",
  });

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    const unsubscribe = projectService.subscribeToProjects(
      user.uid, 
      (data) => {
        setProjects(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("RTDB Subscription Error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProject.name) return;

    try {
      await projectService.createProject(user.uid, {
        name: newProject.name,
        spreadsheetId: newProject.spreadsheetId,
        sheetName: newProject.sheetName,
        sheetId: "0",
        fields: [
          { id: "mssv", label: "MSSV" },
          { id: "name", label: "Họ Tên" },
          { id: "class", label: "Lớp" },
        ],
      });
      setIsAdding(false);
      setNewProject({ name: "", spreadsheetId: "", sheetName: "Sheet1" });
    } catch (error) {
      console.error("Failed to create project", error);
      alert("Lỗi khi tạo dự án");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Bạn có chắc chắn muốn xóa dự án này? Toàn bộ cấu hình sẽ bị mất.")) return;
    await projectService.deleteProject(user.uid, id);
  };

  if (loading) return <div className="p-8 text-center text-office-text-secondary office-sm uppercase tracking-widest animate-pulse">Đang nạp dữ liệu...</div>;
  
  if (error) {
    return (
      <div className="office-card p-12 text-center border-red-200 bg-red-50">
        <Database size={48} className="mx-auto text-red-300 mb-4" />
        <h3 className="font-bold text-red-800 mb-2 uppercase">Lỗi kết nối</h3>
        <p className="text-red-600 office-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="office-btn-primary bg-red-600 border-red-700 hover:bg-red-700">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-office-text-secondary uppercase tracking-widest">Dự án của bạn</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="office-btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Dự án mới
        </button>
      </div>

      {projects.length === 0 && !isAdding && (
        <div className="office-card p-12 text-center">
          <Database size={48} className="mx-auto text-office-border mb-4" />
          <h3 className="font-bold text-office-text mb-2">Không tìm thấy dự án</h3>
          <p className="text-office-text-secondary office-sm mb-6">Tạo dự án đầu tiên của bạn để bắt đầu quét mã QR.</p>
          <button onClick={() => setIsAdding(true)} className="office-btn-secondary">Bắt đầu ngay</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="office-card group hover:border-office-primary transition-all">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-office bg-office-bg group-hover:bg-office-primary/10 transition-colors">
                  <QrCode size={24} className="text-office-primary" />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      const url = `${window.location.origin}/p/${project.id}/scanner`;
                      navigator.clipboard.writeText(url);
                      alert("Đã sao chép liên kết! Hãy mở liên kết này trên điện thoại của bạn.");
                    }}
                    className="p-1.5 text-office-text-muted hover:text-office-primary transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 text-office-text-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <Link href={`/p/${project.id}/dashboard`} className="block group/title">
                <h3 className="text-lg font-bold text-office-text mb-1 truncate group-hover/title:text-office-primary transition-colors">{project.name}</h3>
              </Link>
              <p className="office-xs text-office-text-secondary mb-4 flex items-center gap-1">
                <Database size={12} /> {project.sheetName}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-6">
                <Link 
                  href={`/p/${project.id}/scanner`}
                  className="office-btn-primary office-xs flex items-center justify-center gap-2 py-2"
                >
                  <QrCode size={14} /> Trình quét
                </Link>
                <Link 
                  href={`/p/${project.id}/settings`}
                  className="office-btn-secondary office-xs flex items-center justify-center gap-2 py-2"
                >
                  <Settings size={14} /> Cấu hình
                </Link>
              </div>
            </div>
            <div className="border-t border-office-border p-3 bg-office-header flex justify-between items-center group-hover:bg-white transition-colors">
              <span className="office-xs font-bold text-office-text-muted uppercase tracking-tighter">
                ID: {project.id.substring(0, 8)}...
              </span>
              {project.spreadsheetId && (
                <a 
                  href={`https://docs.google.com/spreadsheets/d/${project.spreadsheetId}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-office-primary office-xs font-bold hover:underline flex items-center gap-1"
                >
                  Sheet <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding Project */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="office-card w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-office-primary p-4 flex justify-between items-center">
              <h3 className="text-white font-bold uppercase tracking-widest office-sm flex items-center gap-2">
                <Plus size={18} /> Tạo dự án mới
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="office-xs font-bold text-office-text-secondary uppercase">Tên dự án</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Điểm danh thi học kỳ"
                  className="office-input w-full"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="office-xs font-bold text-office-text-secondary uppercase">Google Spreadsheet ID</label>
                <input 
                  type="text" 
                  placeholder="Dán ID từ đường dẫn URL"
                  className="office-input w-full"
                  value={newProject.spreadsheetId}
                  onChange={e => setNewProject({...newProject, spreadsheetId: e.target.value})}
                />
                <p className="office-xs text-office-text-muted italic">Có thể bổ sung sau trong phần cài đặt</p>
              </div>

              <div className="space-y-1">
                <label className="office-xs font-bold text-office-text-secondary uppercase">Tên Sheet mặc định</label>
                <input 
                  type="text" 
                  className="office-input w-full"
                  value={newProject.sheetName}
                  onChange={e => setNewProject({...newProject, sheetName: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="office-btn-ghost flex-1">Hủy</button>
                <button type="submit" className="office-btn-primary flex-1">Tạo dự án</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
