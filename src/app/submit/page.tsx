
"use client";
import ProtectedRoute from "@/components/layout/protected-route";
import { FileUploader } from "@/components/core/file-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileArchive, FileCode2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Submission } from "@/types";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/use-auth"; // To get real user ID later

export default function SubmitPage() {
  const { toast } = useToast();
  const router = useRouter();
  // const { user } = useAuth(); // Uncomment when ready to use real user data

  const handleFileSubmit = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${apiBaseUrl}/submit`, {
        method: 'POST',
        body: formData,
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
      
      const newSubmission: Submission = {
        id: result.submissionId,
        // userId: user?.uid || 'mock-user-id', // TODO: Replace with actual user ID
        // userName: user?.displayName || 'Mock User', // TODO: Replace with actual user name
        userId: 'mock-user-id', // Keeping mock for now
        userName: 'Mock User',   // Keeping mock for now
        fileName: result.fileName,
        submittedAt: new Date().toISOString(),
        status: 'Processing', // Initial status, backend will update this later via DB
      };
      
      if(typeof window !== "undefined") {
        let submissions: Submission[] = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
        submissions = submissions.filter(s => s.id !== newSubmission.id); // Avoid duplicates
        localStorage.setItem('mockSubmissions', JSON.stringify([newSubmission, ...submissions]));
      }

      toast({
        title: "Submission Successful",
        description: `File ${result.fileName} sent. ID: ${result.submissionId}. You will be redirected.`,
      });

      router.push(`/submissions/${result.submissionId}`);

    } catch (error: any) {
      console.error("File submission failed:", error);
      // Toast if it's a network error or an error not already toasted from response.ok check
      if (!error.message.startsWith("Server error:") && !(error.message.includes("Upload failed"))) {
          toast({
            title: "Submission Failed",
            description: error.message || "A network error occurred or the server is unreachable. Please try again.",
            variant: "destructive",
          });
      }
      throw error; // Re-throw to allow FileUploader to handle its state
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
