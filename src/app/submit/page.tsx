
"use client";
import ProtectedRoute from "@/components/layout/protected-route";
import { FileUploader } from "@/components/core/file-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileArchive, FileCode2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Submission } from "@/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth"; 

export default function SubmitPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth(); 

  const handleFileSubmit = async (file: File): Promise<void> => {
    if (!user || !user.uid) { // Check for user and user.uid
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit.",
        variant: "destructive",
      });
      router.push('/auth/login');
      throw new Error("User not authenticated or user ID missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.uid);
    formData.append("userName", user.displayName || user.email || "Anonymous User");


    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${apiBaseUrl}/submit`, {
        method: 'POST',
        body: formData,
        // Headers for FormData are set automatically by the browser, including Content-Type: multipart/form-data
      });

      const result = await response.json();

      if (!response.ok) {
        let message = result.detail || `Server error: ${response.statusText}`;
        toast({
          title: "Submission Failed",
          description: message,
          variant: "destructive",
        });
        throw new Error(message);
      }
      
      // Create a submission object to store temporarily in localStorage for the redirect.
      // The single source of truth will be Firestore.
      const newSubmission: Submission = {
        id: result.submissionId,
        userId: user.uid, 
        userName: user.displayName || user.email || 'User', // Use consistent naming
        fileName: result.fileName,
        submittedAt: result.submittedAt || new Date().toISOString(), // Use timestamp from backend if available
        status: 'Processing', // Initial status after successful POST
      };
      
      if(typeof window !== "undefined") {
        let submissions: Submission[] = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
        submissions = submissions.filter(s => s.id !== newSubmission.id);
        localStorage.setItem('mockSubmissions', JSON.stringify([newSubmission, ...submissions].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())));
      }

      toast({
        title: "Submission Successful",
        description: `File ${result.fileName} sent. ID: ${result.submissionId}. You will be redirected.`,
      });

      router.push(`/submissions/${result.submissionId}`);

    } catch (error: any) {
      console.error("File submission failed:", error);
      // Avoid duplicate toasts if error is already specific
      if (!(error.message.startsWith("Server error:") || 
            error.message.includes("Upload failed") || 
            error.message === "User not authenticated or user ID missing" ||
            error.message.includes("Failed to fetch"))) {
          toast({
            title: "Submission Processing Error",
            description: error.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
      } else if (error.message.includes("Failed to fetch")) {
         toast({
            title: "Network Error",
            description: "Could not connect to the backend server. Please ensure it's running and try again.",
            variant: "destructive",
          });
      }
      throw error; // Re-throw to allow FileUploader to reset its state
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Submit Your Code</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Upload your solution and see how it performs on the Face2Profile dataset.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileArchive className="h-6 w-6 text-primary" />
                Upload Your Archive
              </CardTitle>
              <CardDescription>
                Package your code in a <code>.zip</code> or <code>.tar.gz</code> file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader 
                onFileSelect={handleFileSubmit} 
                acceptedFileTypes={['.zip', '.tar.gz']} 
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-6 w-6 text-primary" />
                Submission Format
              </CardTitle>
              <CardDescription>
                Ensure your archive follows this structure for successful processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <FileCode2 className="h-5 w-5" />
                <AlertTitle>Required: `predict.py`</AlertTitle>
                <AlertDescription>
                  Your main script that takes input and generates profile summaries. 
                  It will be run with: <br />
                  <code>python predict.py --input /app/input --output /app/output</code>
                </AlertDescription>
              </Alert>
              <Alert>
                <Package className="h-5 w-5" />
                <AlertTitle>Required: `requirements.txt`</AlertTitle>
                <AlertDescription>
                  A file listing all Python dependencies for your project.
                </AlertDescription>
              </Alert>
              <Alert variant="default">
                 <FileCode2 className="h-5 w-5" />
                <AlertTitle>Optional: `README.md`</AlertTitle>
                <AlertDescription>
                  Include any specific instructions or notes about your submission.
                </AlertDescription>
              </Alert>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="font-semibold mb-2">Example Structure:</p>
                <pre className="text-xs whitespace-pre-wrap">
{`submission.zip/
├── predict.py
├── requirements.txt
└── README.md (optional)
`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
