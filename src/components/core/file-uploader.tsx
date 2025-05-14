
"use client";
import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, FileText, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[]; // e.g. ['.zip', '.tar.gz']
  maxFileSize?: number; // in bytes
}

export function FileUploader({ 
  onFileSelect, 
  acceptedFileTypes = ['.zip', '.tar.gz'],
  maxFileSize = 10 * 1024 * 1024 // 10MB default
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      validateAndSetFile(event.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a ${acceptedFileTypes.join(' or ')} file.`,
        variant: "destructive",
      });
      setSelectedFile(null);
      return;
    }
    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: `File size cannot exceed ${maxFileSize / (1024*1024)}MB.`,
        variant: "destructive",
      });
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      validateAndSetFile(event.dataTransfer.files[0]);
    }
  }, [acceptedFileTypes, maxFileSize]);

  const handleSubmit = async () => {
    if (selectedFile) {
      setIsSubmitting(true);
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      onFileSelect(selectedFile);
      toast({
        title: "Submission Started",
        description: `${selectedFile.name} is being processed.`,
      });
      setSelectedFile(null); // Clear file after successful "submission"
      setIsSubmitting(false);
    } else {
       toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    // Reset file input if needed
    const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="w-full space-y-6">
      <div
        className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-accent/20' : 'border-border hover:border-primary/70'}
          ${selectedFile ? 'border-primary bg-primary/5' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload-input')?.click()}
      >
        <Input
          id="file-upload-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFileTypes.join(',')}
        />
        {selectedFile ? (
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-2 text-sm font-medium text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeFile(); }} className="mt-2 text-destructive hover:text-destructive">
              <XCircle className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        ) : (
          <>
            <UploadCloud className={`mx-auto h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="mt-2 text-sm text-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedFileTypes.join(', ').toUpperCase()} (MAX. {maxFileSize / (1024*1024)}MB)
            </p>
          </>
        )}
      </div>
      <Button onClick={handleSubmit} className="w-full" size="lg" disabled={!selectedFile || isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? "Submitting..." : "Submit Code"}
      </Button>
    </div>
  );
}
