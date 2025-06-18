import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
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

// Validation schemas
const optionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Option text is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  scentMappings: z.record(z.string(), z.number())
});

const questionSchema = z.object({
  text: z.string().min(3, 'Question text is required'),
  type: z.enum(['multiple_choice', 'checkbox', 'slider', 'image_choice']),
  order: z.number().min(1, 'Order is required'),
  layout: z.enum(['standard', 'grid', 'carousel', 'cardstack']).default('standard'),
  isMainQuestion: z.boolean().default(false),
  parentId: z.number().nullable().optional(),
  parentOptionId: z.string().nullable().optional(),
  options: z.array(optionSchema).min(1, 'At least one option is required')
});

type Question = z.infer<typeof questionSchema> & { id: number };

// Define a type for the scent objects
interface Scent {
  id: number;
  name: string;
  notes: string[];
  description: string;
  imageUrl?: string;
}

export default function AdminQuestions() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Get all questions
  const { data: questions, isLoading, isError } = useQuery<Question[]>({
    queryKey: ['/api/questions'],
  });
  
  // Get all scents for mapping
  const { data: scents } = useQuery<Scent[]>({
    queryKey: ['/api/scents'],
  });
  
  // Create question
  const createQuestion = useMutation({
    mutationFn: async (data: z.infer<typeof questionSchema>) => {
      console.log('Submitting data to API:', data);
      const res = await apiRequest('POST', '/api/questions', data);
      const jsonResponse = await res.json();
      console.log('API response:', jsonResponse);
      return jsonResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      toast({
        title: 'Success',
        description: 'Question created successfully',
      });
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('Error in createQuestion:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to create question: ${errorMsg}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update question
  const updateQuestion = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof questionSchema> }) => {
      console.log('Updating question data:', data);
      const res = await apiRequest('PUT', `/api/questions/${id}`, data);
      const jsonResponse = await res.json();
      console.log('API update response:', jsonResponse);
      return jsonResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      toast({
        title: 'Success',
        description: 'Question updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('Error in updateQuestion:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to update question: ${errorMsg}`,
        variant: 'destructive',
      });
    },
  });
  
  // Delete question
  const deleteQuestion = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      toast({
        title: 'Success',
        description: 'Question deleted successfully',
      });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete question: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Form for adding/editing questions
  const QuestionForm = ({ isEdit = false, onClose }: { isEdit?: boolean; onClose: () => void }) => {
    const [options, setOptions] = useState<Array<any>>(
      isEdit && currentQuestion?.options ? 
        currentQuestion.options : 
        [{ id: `option_${Date.now()}`, text: '', description: '', scentMappings: {} }]
    );
    
    const form = useForm<z.infer<typeof questionSchema>>({
      resolver: zodResolver(questionSchema),
      defaultValues: isEdit && currentQuestion ? {
        text: currentQuestion.text,
        type: currentQuestion.type,
        order: currentQuestion.order,
        layout: currentQuestion.layout || 'standard',
        isMainQuestion: currentQuestion.isMainQuestion || false,
        parentId: currentQuestion.parentId || null,
        parentOptionId: currentQuestion.parentOptionId || null,
        options: currentQuestion.options
      } : {
        text: '',
        type: 'multiple_choice',
        order: questions ? questions.length + 1 : 1,
        layout: 'standard',
        isMainQuestion: false,
        parentId: null,
        parentOptionId: null,
        options: [{ id: `option_${Date.now()}`, text: '', description: '', scentMappings: {} }]
      },
    });
    
    const addOption = () => {
      const newOption = { 
        id: `option_${Date.now()}`, 
        text: '', 
        description: '', 
        scentMappings: {} 
      };
      setOptions([...options, newOption]);
      const currentOptions = form.getValues('options');
      form.setValue('options', [...currentOptions, newOption]);
    };
    
    const removeOption = (index: number) => {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      form.setValue('options', newOptions);
    };
    
    const updateScentMapping = (optionIndex: number, scentName: string, value: number) => {
      const newOptions = [...options];
      newOptions[optionIndex].scentMappings[scentName] = value;
      setOptions(newOptions);
      form.setValue('options', newOptions);
    };
    
    const onSubmit = (data: z.infer<typeof questionSchema>) => {
      // Pastikan data yang dikirim valid dan layout disertakan
      const formattedData = {
        ...data,
        layout: data.layout || 'standard' // Pastikan nilai layout selalu disertakan
      };
      
      console.log('Form data to submit:', formattedData);
      
      if (isEdit && currentQuestion) {
        updateQuestion.mutate({ id: currentQuestion.id, data: formattedData });
      } else {
        createQuestion.mutate(formattedData);
      }
    };
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Text</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your question here..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="image_choice">Image Options</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('type') !== 'image_choice' && form.watch('type') !== 'checkbox' && (
              <FormField
                control={form.control}
                name="layout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Layout</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || 'standard'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select layout style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard Layout</SelectItem>
                        <SelectItem value="grid">Grid Cards Layout</SelectItem>
                        <SelectItem value="carousel">Carousel Layout</SelectItem>
                        <SelectItem value="cardstack">3D Card Stack Layout</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how the question options will be displayed to users
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">Branching Settings</h3>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="isMainQuestion"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Set as main question (this is the starting point of a quiz branch)
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {!form.watch('isMainQuestion') && (
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Question</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent question" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {questions?.filter(q => q.isMainQuestion).map(q => (
                            <SelectItem key={q.id} value={q.id.toString()}>
                              {q.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select which main question this branch belongs to
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {form.watch('parentId') && (
                  <FormField
                    control={form.control}
                    name="parentOptionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option from Parent</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {questions?.find(q => q.id === form.watch('parentId'))?.options.map(option => (
                              <SelectItem key={option.id} value={option.id || ''}>
                                {option.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This question will show when this option is selected in the parent question
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Option
              </Button>
            </div>
            
            {options.map((option, index) => (
              <div key={option.id} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-start mb-2">
                  <Label className="text-sm font-medium">Option {index + 1}</Label>
                  {options.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-4 mb-4">
                  <div>
                    <Label htmlFor={`option-text-${index}`}>Text</Label>
                    <Input
                      id={`option-text-${index}`}
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].text = e.target.value;
                        setOptions(newOptions);
                        form.setValue(`options.${index}.text`, e.target.value);
                      }}
                      placeholder="Option text"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`option-desc-${index}`}>Description (optional)</Label>
                    <Input
                      id={`option-desc-${index}`}
                      value={option.description || ''}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].description = e.target.value;
                        setOptions(newOptions);
                        form.setValue(`options.${index}.description`, e.target.value);
                      }}
                      placeholder="Description"
                    />
                  </div>
                  
                  {/* Image URL field - available for all question types */}
                  <div className="mt-2">
                    <Label htmlFor={`option-image-${index}`}>Image URL (optional)</Label>
                    <Input
                      id={`option-image-${index}`}
                      value={option.imageUrl || ''}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].imageUrl = e.target.value;
                        setOptions(newOptions);
                        form.setValue(`options.${index}.imageUrl`, e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                    {option.imageUrl && (
                      <div className="mt-2 border rounded p-2">
                        <p className="text-xs text-muted-foreground mb-1">Image Preview:</p>
                        <img 
                          src={option.imageUrl} 
                          alt={option.text}
                          className="w-full h-32 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Scent Mappings</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {scents && Array.isArray(scents) && scents.map((scent: Scent) => (
                      <div key={scent.id} className="flex items-center gap-2">
                        <Label htmlFor={`scent-${scent.id}-option-${index}`} className="w-1/2">
                          {scent.name}
                        </Label>
                        <Input
                          id={`scent-${scent.id}-option-${index}`}
                          type="number"
                          min="0"
                          max="5"
                          className="w-1/2"
                          value={option.scentMappings[scent.name] || 0}
                          onChange={(e) => updateScentMapping(
                            index, 
                            scent.name, 
                            parseInt(e.target.value) || 0
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createQuestion.isPending || updateQuestion.isPending}>
              {(createQuestion.isPending || updateQuestion.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? 'Update' : 'Create'} Question
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
              <CardTitle>Error Loading Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>An error occurred while loading questions. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/questions'] })}>
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
        <title>Manage Questions | Fordive Admin</title>
        <meta name="description" content="Manage quiz questions for the Fordive Scent Finder." />
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
              <h1 className="text-3xl font-playfair font-bold mt-2">Questions Management</h1>
              <p className="text-muted-foreground">Manage quiz questions and their options</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Question</DialogTitle>
                  <DialogDescription>
                    Create a new question for the quiz. Questions can have multiple choice, checkbox, or slider options.
                  </DialogDescription>
                </DialogHeader>
                <QuestionForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          {questions && questions.length > 0 ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="w-28">Type</TableHead>
                    <TableHead className="w-24">Options</TableHead>
                    <TableHead className="w-28">Branch Status</TableHead>
                    <TableHead className="w-28 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.sort((a, b) => a.order - b.order).map((question) => (
                    <TableRow key={question.id} className={question.isMainQuestion ? "bg-primary/5" : ""}>
                      <TableCell>{question.order}</TableCell>
                      <TableCell>{question.text}</TableCell>
                      <TableCell>
                        <div className="capitalize">
                          {question.type.replace('_', ' ')}
                        </div>
                      </TableCell>
                      <TableCell>{question.options?.length || 0}</TableCell>
                      <TableCell>
                        {question.isMainQuestion ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                            Main Question
                          </span>
                        ) : question.parentId ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            Branch Question
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Standard Question
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            {currentQuestion?.id === question.id && (
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Question</DialogTitle>
                                  <DialogDescription>
                                    Update this question and its options.
                                  </DialogDescription>
                                </DialogHeader>
                                <QuestionForm isEdit={true} onClose={() => setIsEditDialogOpen(false)} />
                              </DialogContent>
                            )}
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentQuestion(question);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog open={deleteId === question.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteId(question.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the question and all of its options.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteQuestion.mutate(question.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deleteQuestion.isPending ? (
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
                <CardTitle>No Questions Found</CardTitle>
                <CardDescription>
                  There are no questions yet. Click the "Add Question" button to create your first quiz question.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
