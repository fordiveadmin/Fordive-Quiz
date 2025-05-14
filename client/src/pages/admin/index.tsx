import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, FileQuestion, FlaskRound, Sparkles } from 'lucide-react';

export default function AdminIndex() {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Fordive Scent Finder</title>
        <meta name="description" content="Admin dashboard for Fordive Scent Finder application." />
      </Helmet>
      
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-playfair font-bold mb-2">Fordive Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your questions, scents, and zodiac mappings</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  Questions Management
                </CardTitle>
                <CardDescription>
                  Create, edit, or delete quiz questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Manage quiz questions including multiple choice, checkbox, and slider types.
                  Set options and scoring for each question.
                </p>
                <Link href="/admin/questions">
                  <Button className="w-full" variant="outline">
                    Manage Questions
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskRound className="h-5 w-5 text-primary" />
                  Scents Management
                </CardTitle>
                <CardDescription>
                  Add, edit, or remove fragrance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Manage perfume details including names, notes, vibes, mood descriptions, and categories.
                </p>
                <Link href="/admin/scents">
                  <Button className="w-full" variant="outline">
                    Manage Scents
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Zodiac Mappings
                </CardTitle>
                <CardDescription>
                  Configure zodiac sign to scent mappings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Set up how each zodiac sign relates to different fragrances with custom descriptions.
                </p>
                <Link href="/admin/zodiac">
                  <Button className="w-full" variant="outline">
                    Manage Zodiac Mappings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-10">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Data Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="text-2xl font-bold">Quiz Questions</div>
                    <p className="text-muted-foreground">Current Format: JSON</p>
                    <p className="text-sm mt-2">Stored in: questions.json</p>
                  </div>
                  
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="text-2xl font-bold">Scents Collection</div>
                    <p className="text-muted-foreground">Current Format: JSON</p>
                    <p className="text-sm mt-2">Stored in: scents.json</p>
                  </div>
                  
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="text-2xl font-bold">Zodiac Mappings</div>
                    <p className="text-muted-foreground">Current Format: JSON</p>
                    <p className="text-sm mt-2">Stored in: zodiac_mapping.json</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/">
              <Button variant="ghost">Return to Public Site</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
