
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Trophy, UploadCloud } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center space-y-12 py-8 md:py-16">
      <header className="space-y-4">
        <Cpu className="mx-auto h-20 w-20 text-primary" />
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          Welcome to Profile Forge
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          The ultimate NLP competition platform. Submit your code, process Face2Profile data, and climb the leaderboard!
        </p>
      </header>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
          <Link href="/leaderboard">
            <Trophy className="mr-2 h-5 w-5" /> View Leaderboard
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="shadow-lg hover:shadow-xl transition-shadow">
          <Link href="/submit">
            <UploadCloud className="mr-2 h-5 w-5" /> Submit Your Code
          </Link>
        </Button>
      </div>

      <section className="grid md:grid-cols-3 gap-8 pt-8 w-full max-w-5xl">
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-accent" />
              Sophisticated Evaluation
            </CardTitle>
            <CardDescription>
              Your submissions are evaluated using BLEU-4, Custom-BLEU, and Entity Coverage Score (ECS).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>We ensure fair and comprehensive assessment of your NLP models.</p>
          </CardContent>
        </Card>
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-6 w-6 text-accent" />
              Seamless Submissions
            </CardTitle>
            <CardDescription>
              Easily upload your code as a `.zip` or `.tar.gz` archive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Focus on your model, we'll handle the execution and evaluation.</p>
          </CardContent>
        </Card>
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-accent" />
              Public Leaderboard
            </CardTitle>
            <CardDescription>
              Compete with others and showcase your NLP prowess on the public leaderboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Track your progress and see how you stack up against the best.</p>
          </CardContent>
        </Card>
      </section>
      
      <section className="pt-8 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
        <Image 
          src="https://placehold.co/800x400.png" 
          alt="Workflow diagram placeholder"
          data-ai-hint="workflow diagram" 
          width={800} 
          height={400} 
          className="rounded-lg shadow-xl object-cover" 
        />
        <p className="mt-4 text-muted-foreground">
          1. Register and login. 2. Prepare your code according to the submission format. 3. Upload your archive. 4. Our system runs your code in a secure environment. 5. View your results and ranking!
        </p>
      </section>
    </div>
  );
}
