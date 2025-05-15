import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, Download, Search, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: quizResults, isLoading } = useQuery({
    queryKey: ['/api/analytics/quiz-results'],
  });
  
  // Calculate stats
  const totalParticipants = quizResults?.length || 0;
  
  // Function to download CSV
  const downloadCSV = () => {
    if (!quizResults || quizResults.length === 0) return;
    
    // Prepare CSV header row
    const headers = ['Nama', 'Email', 'Parfum', 'Zodiak', 'Tanggal'];
    
    // Prepare CSV data rows
    const csvData = quizResults.map((result: any) => {
      return [
        result.userName,
        result.userEmail,
        result.scentName,
        result.zodiacSign || 'Tidak diisi',
        formatDate(new Date(result.createdAt))
      ];
    });
    
    // Combine header and data rows
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fordive-participants-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Filter results based on search term
  const filteredResults = quizResults?.filter((result: any) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      result.userName.toLowerCase().includes(searchTermLower) ||
      result.userEmail.toLowerCase().includes(searchTermLower) ||
      result.scentName.toLowerCase().includes(searchTermLower) ||
      (result.zodiacSign && result.zodiacSign.toLowerCase().includes(searchTermLower))
    );
  });
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Data Analitik | Fordive Admin</title>
        <meta name="description" content="Analisis data pengguna quiz Fordive Scent Finder" />
      </Helmet>
      
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold">Data Pengguna Quiz</h1>
            <p className="text-muted-foreground mt-1">
              Lihat dan analisa data pengguna yang telah mengikuti quiz Fordive Scent Finder
            </p>
          </div>
          
          <Button 
            onClick={downloadCSV} 
            className="mt-4 md:mt-0 bg-primary text-white"
            disabled={!quizResults || quizResults.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Total Peserta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalParticipants}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Jumlah pengguna yang telah menyelesaikan quiz
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Top Scents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {quizResults && quizResults.length > 0
                  ? (() => {
                      const scentCounts: Record<string, number> = {};
                      quizResults.forEach((result: any) => {
                        scentCounts[result.scentName] = (scentCounts[result.scentName] || 0) + 1;
                      });
                      
                      const topScent = Object.entries(scentCounts)
                        .sort((a, b) => b[1] - a[1])[0];
                      
                      return topScent ? topScent[0] : 'Belum ada data';
                    })()
                  : 'Belum ada data'
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Parfum yang paling banyak direkomendasikan
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                Analytics & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">Lebih detail segera hadir</div>
              <p className="text-xs text-muted-foreground mt-1">
                Dashboard analitik lengkap sedang dikembangkan
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Detail Data Pengguna</CardTitle>
            <CardDescription>
              Daftar pengguna yang telah menyelesaikan quiz Fordive Scent Finder
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, email, parfum, atau zodiak..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !quizResults || quizResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Belum ada data pengguna yang tersedia
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Parfum</TableHead>
                      <TableHead>Zodiak</TableHead>
                      <TableHead>Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result: any) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.userName}</TableCell>
                        <TableCell>{result.userEmail}</TableCell>
                        <TableCell>{result.scentName}</TableCell>
                        <TableCell>{result.zodiacSign || '—'}</TableCell>
                        <TableCell>{formatDate(new Date(result.createdAt))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}