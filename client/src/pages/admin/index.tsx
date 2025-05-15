import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, FileQuestion, FlaskRound, Sparkles, Users, BarChart3 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminIndex() {
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | Fordive Scent Finder</title>
        <meta name="description" content="Admin dashboard for Fordive Scent Finder application." />
      </Helmet>
      
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-playfair font-bold mb-2">Fordive Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola quiz, parfum, dan lihat data pengguna</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  Pertanyaan Quiz
                </CardTitle>
                <CardDescription>
                  Buat, edit, atau hapus pertanyaan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/questions">
                  <Button className="w-full" variant="outline">
                    Kelola Pertanyaan
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FlaskRound className="h-5 w-5 text-primary" />
                  Parfum
                </CardTitle>
                <CardDescription>
                  Tambah, edit, atau hapus parfum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/scents">
                  <Button className="w-full" variant="outline">
                    Kelola Parfum
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Zodiak
                </CardTitle>
                <CardDescription>
                  Kelola keterkaitan zodiak dan parfum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/zodiac">
                  <Button className="w-full" variant="outline">
                    Kelola Zodiak
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Data Pengguna
                </CardTitle>
                <CardDescription>
                  Lihat dan unduh data pengguna quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/analytics">
                  <Button className="w-full" variant="default">
                    Lihat Data Pengguna
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
    </AdminLayout>
  );
}
