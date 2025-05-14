
"use client";
import ProtectedRoute from "@/components/layout/protected-route";
import { FileUploader } from "@/components/core/file-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileArchive, FileCode2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Submission } from "@/types"; // Assuming you have a Submission type
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSubmit = (file: File) => {
    // This is where you would typically initiate the actual upload and backend processing.
    // For this UI-focused task, we'll simulate it and potentially navigate or update state.
    console.log("File submitted:", file.name);

    // Simulate creating a new submission and navigating to its page
    const newSubmissionId = `sub_${Date.now()}`;
    const newSubmission: Submission = {
      id: newSubmissionId,
      userId: 'mock-user-id', // from useAuth().user.uid
      userName: 'Mock User', // from useAuth().user.displayName
      fileName: file.name,
      submittedAt: new Date().toISOString(),
      status: 'Processing',
    };
    
    // Store mock submission for demo purposes (in a real app, this comes from backend)
    if(typeof window !== "undefined") {
      const submissions = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
      localStorage.setItem('mockSubmissions', JSON.stringify([newSubmission, ...submissions]));
    }

    toast({
      title: "Submission Processing",
      description: `Your file ${file.name} has been submitted and is now processing.`,
    });

    router.push(`/submissions/${newSubmissionId}`);
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
              <FileUploader onFileSelect={handleFileSubmit} acceptedFileTypes={['.zip', '.tar.gz']} />
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
