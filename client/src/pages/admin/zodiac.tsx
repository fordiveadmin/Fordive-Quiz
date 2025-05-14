import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { zodiacSigns } from '@/lib/zodiac';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Loader2,
  AlertCircle
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
const zodiacMappingSchema = z.object({
  zodiacSign: z.string().min(1, 'Zodiac sign is required'),
  scentId: z.number().min(1, 'Scent is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ZodiacMapping = z.infer<typeof zodiacMappingSchema> & { id: number };

export default function AdminZodiac() {
  const { toast } = useToast();
  const [currentZodiacSign, setCurrentZodiacSign] = useState(zodiacSigns[0].name);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMapping, setCurrentMapping] = useState<ZodiacMapping | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Get all zodiac mappings
  const { data: allMappings, isLoading: mappingsLoading, isError: mappingsError } = useQuery<ZodiacMapping[]>({
    queryKey: ['/api/zodiac-mappings'],
  });
  
  // Get all scents
  const { data: scents, isLoading: scentsLoading, isError: scentsError } = useQuery({
    queryKey: ['/api/scents'],
  });
  
  // Create zodiac mapping
  const createMapping = useMutation({
    mutationFn: async (data: z.infer<typeof zodiacMappingSchema>) => {
      const res = await apiRequest('POST', '/api/zodiac-mappings', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/zodiac-mappings'] });
      toast({
        title: 'Success',
        description: 'Zodiac mapping created successfully',
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create mapping: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update zodiac mapping
  const updateMapping = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof zodiacMappingSchema> }) => {
      const res = await apiRequest('PUT', `/api/zodiac-mappings/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/zodiac-mappings'] });
      toast({
        title: 'Success',
        description: 'Zodiac mapping updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update mapping: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Delete zodiac mapping
  const deleteMapping = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/zodiac-mappings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/zodiac-mappings'] });
      toast({
        title: 'Success',
        description: 'Zodiac mapping deleted successfully',
      });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete mapping: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Get mappings for the current zodiac sign
  const getZodiacMappings = () => {
    if (!allMappings) return [];
    return allMappings.filter(mapping => mapping.zodiacSign === currentZodiacSign);
  };
  
  // Form for adding/editing zodiac mappings
  const MappingForm = ({ isEdit = false, onClose }: { isEdit?: boolean; onClose: () => void }) => {
    const form = useForm<z.infer<typeof zodiacMappingSchema>>({
      resolver: zodResolver(zodiacMappingSchema),
      defaultValues: isEdit && currentMapping ? {
        zodiacSign: currentMapping.zodiacSign,
        scentId: currentMapping.scentId,
        description: currentMapping.description
      } : {
        zodiacSign: currentZodiacSign,
        scentId: 0,
        description: ''
      },
    });
    
    const onSubmit = (data: z.infer<typeof zodiacMappingSchema>) => {
      if (isEdit && currentMapping) {
        updateMapping.mutate({ id: currentMapping.id, data });
      } else {
        createMapping.mutate(data);
      }
    };
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="zodiacSign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zodiac Sign</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zodiac sign" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {zodiacSigns.map((sign) => (
                      <SelectItem key={sign.name} value={sign.name}>
                        {sign.name} ({sign.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="scentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scent</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {scents && scents.map((scent) => (
                      <SelectItem key={scent.id} value={scent.id.toString()}>
                        {scent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    placeholder="Description of how this zodiac sign relates to the scent" 
                    {...field} 
                    rows={5}
                  />
                </FormControl>
                <FormDescription>
                  Describe how this zodiac sign's personality traits align with the selected fragrance
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMapping.isPending || updateMapping.isPending}>
              {(createMapping.isPending || updateMapping.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? 'Update' : 'Create'} Mapping
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  if (mappingsLoading || scentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (mappingsError || scentsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error Loading Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>An error occurred while loading data. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/zodiac-mappings'] });
              queryClient.invalidateQueries({ queryKey: ['/api/scents'] });
            }}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const currentMappings = getZodiacMappings();
  
  return (
    <>
      <Helmet>
        <title>Manage Zodiac Mappings | Fordive Admin</title>
        <meta name="description" content="Manage zodiac sign to scent mappings for the Fordive Scent Finder." />
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
              <h1 className="text-3xl font-playfair font-bold mt-2">Zodiac Mappings</h1>
              <p className="text-muted-foreground">Manage zodiac sign to fragrance mappings</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Mapping
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Zodiac Mapping</DialogTitle>
                  <DialogDescription>
                    Create a new mapping between a zodiac sign and a fragrance.
                  </DialogDescription>
                </DialogHeader>
                <MappingForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs 
            defaultValue={zodiacSigns[0].name} 
            value={currentZodiacSign}
            onValueChange={setCurrentZodiacSign}
            className="w-full"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
                {zodiacSigns.map((sign) => (
                  <TabsTrigger key={sign.name} value={sign.name} className="text-xs md:text-sm gap-1">
                    <span className="hidden md:inline">{sign.name}</span>
                    <span className="md:hidden">{sign.symbol}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {zodiacSigns.map((sign) => (
              <TabsContent key={sign.name} value={sign.name} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{sign.symbol}</span>
                      <span>{sign.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {sign.dateRange} • {sign.element} Element
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentMappings.length > 0 ? (
                      <div className="space-y-4">
                        {currentMappings.map((mapping) => {
                          const matchedScent = scents?.find(s => s.id === mapping.scentId);
                          if (!matchedScent) return null;
                          
                          return (
                            <Card key={mapping.id} className="bg-secondary">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{matchedScent.name}</CardTitle>
                                  <div className="flex gap-2">
                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                      {currentMapping?.id === mapping.id && (
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                          <DialogHeader>
                                            <DialogTitle>Edit Zodiac Mapping</DialogTitle>
                                            <DialogDescription>
                                              Update the relationship between {mapping.zodiacSign} and {matchedScent.name}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <MappingForm isEdit={true} onClose={() => setIsEditDialogOpen(false)} />
                                        </DialogContent>
                                      )}
                                    </Dialog>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setCurrentMapping(mapping);
                                        setIsEditDialogOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    
                                    <AlertDialog open={deleteId === mapping.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setDeleteId(mapping.id)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will delete the mapping between {mapping.zodiacSign} and {matchedScent.name}.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => deleteMapping.mutate(mapping.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            {deleteMapping.isPending ? (
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
                                </div>
                                <CardDescription>
                                  {matchedScent.category} • {matchedScent.vibes.join(', ')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-foreground">{mapping.description}</p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">No mappings exist for {sign.name} yet.</p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Add {sign.name} Mapping
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}
