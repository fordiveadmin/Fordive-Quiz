import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';

// Interface for analytics data
interface QuizResultWithUserDetails {
  id: number;
  userName: string;
  userEmail: string;
  scentName: string;
  zodiacSign: string | null;
  createdAt: string; // will be converted from Date
}

export default function AnalyticsPage() {
  const [downloading, setDownloading] = useState(false);

  // Fetch quiz results with user details
  const { data: quizResults = [], isLoading, isError } = useQuery({
    queryKey: ['/api/analytics/quiz-results'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/quiz-results');
      if (!res.ok) throw new Error('Failed to fetch analytics data');
      
      const data = await res.json();
      
      // Convert date strings to formatted dates
      return data.map((result: any) => ({
        ...result,
        createdAt: new Date(result.createdAt),
        zodiacSign: result.zodiacSign || 'Not provided'
      }));
    }
  });

  // Download the quiz data as CSV
  const downloadCSV = () => {
    setDownloading(true);
    try {
      // Create CSV header
      const headers = ['ID', 'Name', 'Email', 'Perfume', 'Zodiac Sign', 'Date'];
      
      // Create CSV rows
      const rows = quizResults.map((result: QuizResultWithUserDetails) => [
        result.id,
        result.userName,
        result.userEmail,
        result.scentName,
        result.zodiacSign || 'Not provided',
        formatDate(new Date(result.createdAt))
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `fordive-quiz-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Analytics | Fordive Admin</title>
      </Helmet>
      
      <div className="container py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Quiz Participants</CardTitle>
              <CardDescription>
                {quizResults.length > 0 
                  ? `${quizResults.length} users have completed the perfume quiz` 
                  : 'No quiz data available yet'
                }
              </CardDescription>
            </div>
            
            <Button 
              onClick={downloadCSV}
              disabled={isLoading || quizResults.length === 0 || downloading}
              className="ml-auto"
            >
              {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Download CSV
            </Button>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading analytics data...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500">
                Failed to load analytics data. Please try again.
              </div>
            ) : quizResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No quiz data available yet. When users complete the quiz, their data will appear here.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableCaption>A list of all users who have completed the perfume quiz</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Zodiac Sign</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizResults.map((result: QuizResultWithUserDetails) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{formatDate(new Date(result.createdAt))}</TableCell>
                        <TableCell>{result.userName}</TableCell>
                        <TableCell>{result.userEmail}</TableCell>
                        <TableCell>{result.scentName}</TableCell>
                        <TableCell>{result.zodiacSign}</TableCell>
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