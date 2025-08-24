import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, Check, Cog, FileImage, FileVideo, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
}

export default function FileUpload() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiRequest('POST', '/api/content/upload', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: "Upload successful",
        description: "Your content has been uploaded and is being processed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9);
      const uploadingFile: UploadingFile = {
        file,
        progress: 0,
        status: 'uploading',
        id,
      };

      setUploadingFiles(prev => [...prev, uploadingFile]);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === id 
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          )
        );
      }, 200);

      uploadMutation.mutate(file, {
        onSuccess: () => {
          clearInterval(progressInterval);
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === id 
                ? { ...f, progress: 100, status: 'completed' }
                : f
            )
          );
          
          // Remove completed files after 3 seconds
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.id !== id));
          }, 3000);
        },
        onError: () => {
          clearInterval(progressInterval);
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === id 
                ? { ...f, status: 'error' }
                : f
            )
          );
        },
      });
    });
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4" data-testid="file-upload">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "upload-zone border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragActive && "dragover"
        )}
        data-testid="upload-zone"
      >
        <input {...getInputProps()} />
        <CloudUpload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 mb-2" data-testid="text-upload-instruction">
          {isDragActive ? "Drop files here..." : "Drag & drop your content here"}
        </p>
        <p className="text-sm text-slate-500" data-testid="text-upload-hint">
          or click to browse files
        </p>
        <Button 
          type="button" 
          className="mt-4 btn-viralo-primary"
          data-testid="button-choose-files"
        >
          Choose Files
        </Button>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700" data-testid="text-uploading-files">
            Uploading Files
          </h4>
          {uploadingFiles.map((uploadingFile) => (
            <div
              key={uploadingFile.id}
              className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
              data-testid={`upload-item-${uploadingFile.id}`}
            >
              <div className="flex-shrink-0">
                {uploadingFile.file.type.startsWith('image/') ? (
                  <FileImage className="h-8 w-8 text-blue-500" />
                ) : (
                  <FileVideo className="h-8 w-8 text-purple-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate" data-testid={`text-filename-${uploadingFile.id}`}>
                  {uploadingFile.file.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {uploadingFile.status === 'uploading' && (
                    <>
                      <Progress value={uploadingFile.progress} className="flex-1 h-2" />
                      <span className="text-xs text-slate-500" data-testid={`text-progress-${uploadingFile.id}`}>
                        {uploadingFile.progress}%
                      </span>
                    </>
                  )}
                  {uploadingFile.status === 'completed' && (
                    <p className="text-xs text-secondary" data-testid={`text-status-${uploadingFile.id}`}>
                      Upload complete
                    </p>
                  )}
                  {uploadingFile.status === 'error' && (
                    <p className="text-xs text-destructive" data-testid={`text-error-${uploadingFile.id}`}>
                      Upload failed
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {uploadingFile.status === 'uploading' && (
                  <Cog className="h-5 w-5 text-accent animate-spin" />
                )}
                {uploadingFile.status === 'completed' && (
                  <Check className="h-5 w-5 text-secondary" />
                )}
                {uploadingFile.status === 'error' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadingFile.id)}
                    data-testid={`button-remove-${uploadingFile.id}`}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
