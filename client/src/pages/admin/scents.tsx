import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { getScentImageUrl } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Validation schema
const scentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  notes: z.array(z.string()).min(1, 'At least one note is required'),
  vibes: z.array(z.string()).min(1, 'At least one vibe is required'),
  mood: z.string().min(1, 'Mood description is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional(),
  purchaseUrl: z.string().url('Must be a valid URL').optional(),
});

type Scent = z.infer<typeof scentSchema> & { 
  id: number;
  imageUrl?: string;
  purchaseUrl?: string;
};

export default function AdminScents() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentScent, setCurrentScent] = useState<Scent | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Get all scents
  const { data: scents, isLoading, isError } = useQuery<Scent[]>({
    queryKey: ['/api/scents'],
  });
  
  // Create scent
  const createScent = useMutation({
    mutationFn: async (data: z.infer<typeof scentSchema>) => {
      const res = await apiRequest('POST', '/api/scents', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scents'] });
      toast({
        title: 'Success',
        description: 'Scent created successfully',
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create scent: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update scent
  const updateScent = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof scentSchema> }) => {
      const res = await apiRequest('PUT', `/api/scents/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scents'] });
      toast({
        title: 'Success',
        description: 'Scent updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update scent: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Delete scent
  const deleteScent = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/scents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scents'] });
      toast({
        title: 'Success',
        description: 'Scent deleted successfully',
      });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete scent: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Form for adding/editing scents
  const ScentForm = ({ isEdit = false, onClose }: { isEdit?: boolean; onClose: () => void }) => {
    const [noteInput, setNoteInput] = useState('');
    const [vibeInput, setVibeInput] = useState('');
    
    const form = useForm<z.infer<typeof scentSchema>>({
      resolver: zodResolver(scentSchema),
      defaultValues: isEdit && currentScent ? {
        name: currentScent.name,
        notes: currentScent.notes,
        vibes: currentScent.vibes,
        mood: currentScent.mood,
        description: currentScent.description,
        category: currentScent.category
      } : {
        name: '',
        notes: [],
        vibes: [],
        mood: '',
        description: '',
        category: 'Fresh'
      },
    });
    
    const addNote = () => {
      if (noteInput.trim()) {
        const currentNotes = form.getValues('notes') || [];
        form.setValue('notes', [...currentNotes, noteInput.trim()]);
        setNoteInput('');
      }
    };
    
    const removeNote = (index: number) => {
      const currentNotes = form.getValues('notes') || [];
      const updatedNotes = [...currentNotes];
      updatedNotes.splice(index, 1);
      form.setValue('notes', updatedNotes);
    };
    
    const addVibe = () => {
      if (vibeInput.trim()) {
        const currentVibes = form.getValues('vibes') || [];
        form.setValue('vibes', [...currentVibes, vibeInput.trim()]);
        setVibeInput('');
      }
    };
    
    const removeVibe = (index: number) => {
      const currentVibes = form.getValues('vibes') || [];
      const updatedVibes = [...currentVibes];
      updatedVibes.splice(index, 1);
      form.setValue('vibes', updatedVibes);
    };
    
    const onSubmit = (data: z.infer<typeof scentSchema>) => {
      if (isEdit && currentScent) {
        updateScent.mutate({ id: currentScent.id, data });
      } else {
        createScent.mutate(data);
      }
    };
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scent Name</FormLabel>
                <FormControl>
                  <Input placeholder="Scent name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fresh">Fresh</SelectItem>
                    <SelectItem value="Floral">Floral</SelectItem>
                    <SelectItem value="Woody">Woody</SelectItem>
                    <SelectItem value="Oriental/Sweet ambery">Oriental/Sweet ambery</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <Label>Notes</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a note"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              />
              <Button type="button" onClick={addNote}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('notes')?.map((note, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {note}
                  <button
                    type="button"
                    onClick={() => removeNote(index)}
                    className="rounded-full hover:bg-secondary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {form.formState.errors.notes && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.notes.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Vibes</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a vibe"
                value={vibeInput}
                onChange={(e) => setVibeInput(e.target.value)}
              />
              <Button type="button" onClick={addVibe}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('vibes')?.map((vibe, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {vibe}
                  <button
                    type="button"
                    onClick={() => removeVibe(index)}
                    className="rounded-full hover:bg-secondary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {form.formState.errors.vibes && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.vibes.message}</p>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mood</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 'Like ocean air at sunrise'" {...field} />
                </FormControl>
                <FormDescription>
                  A short phrase that captures the essence of the scent
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Full description of the fragrance" 
                    {...field} 
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

          
          <FormField
            control={form.control}
            name="purchaseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://fordive.com/shop/perfume" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Enter the URL where customers can purchase this fragrance (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createScent.isPending || updateScent.isPending}>
              {(createScent.isPending || updateScent.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? 'Update' : 'Create'} Scent
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error Loading Scents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>An error occurred while loading scents. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/scents'] })}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Manage Scents | Fordive Admin</title>
        <meta name="description" content="Manage fragrance scents for the Fordive Scent Finder." />
      </Helmet>
      
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link href="/admin">
                <Button variant="ghost" className="pl-0">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-playfair font-bold mt-2">Scents Management</h1>
              <p className="text-muted-foreground">Manage fragrances and their details</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Scent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Scent</DialogTitle>
                  <DialogDescription>
                    Create a new fragrance with notes, vibes, and descriptions.
                  </DialogDescription>
                </DialogHeader>
                <ScentForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          {scents && scents.length > 0 ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Vibes</TableHead>
                    <TableHead className="w-28 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scents.map((scent) => (
                    <TableRow key={scent.id}>
                      <TableCell className="font-medium">{scent.name}</TableCell>
                      <TableCell>{scent.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {scent.notes.slice(0, 3).map((note, i) => (
                            <Badge key={i} variant="outline">{note}</Badge>
                          ))}
                          {scent.notes.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{scent.notes.length - 3} more</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {scent.vibes.map((vibe, i) => (
                            <Badge key={i} variant="secondary">{vibe}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            {currentScent?.id === scent.id && (
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Scent</DialogTitle>
                                  <DialogDescription>
                                    Update this fragrance's details.
                                  </DialogDescription>
                                </DialogHeader>
                                <ScentForm isEdit={true} onClose={() => setIsEditDialogOpen(false)} />
                              </DialogContent>
                            )}
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentScent(scent);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog open={deleteId === scent.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteId(scent.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the fragrance and may affect existing quiz results.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteScent.mutate(scent.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deleteScent.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                  )}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle>No Scents Found</CardTitle>
                <CardDescription>
                  There are no fragrances yet. Click the "Add Scent" button to create your first fragrance.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Scent
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
