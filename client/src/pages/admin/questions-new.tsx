import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Schema untuk validasi form pertanyaan
const questionOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, { message: "Teks opsi wajib diisi" }),
  value: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  scentMappings: z.record(z.string(), z.number()).default({})
});

const questionSchema = z.object({
  text: z.string().min(3, { message: "Pertanyaan harus diisi minimal 3 karakter" }),
  type: z.enum(['multiple_choice', 'checkbox', 'rating_scale']),
  order: z.number().min(1, { message: "Urutan harus minimal 1" }),
  isMainQuestion: z.boolean().default(false),
  parentId: z.number().nullable(),
  parentOptionId: z.string().nullable(),
  options: z.array(questionOptionSchema),
  
  // Rating scale properties
  scaleMin: z.string().optional(),
  scaleMax: z.string().optional(),
  scaleSteps: z.number().optional()
});

type Question = {
  id: number;
  text: string;
  type: 'multiple_choice' | 'checkbox' | 'rating_scale';
  order: number;
  isMainQuestion: boolean;
  parentId: number | null;
  parentOptionId: string | null;
  options: {
    id: string;
    text: string;
    value?: string;
    label?: string;
    description?: string;
    scentMappings: Record<string, number>;
  }[];
  scaleMin?: string;
  scaleMax?: string;
  scaleSteps?: number;
};

export default function QuestionsPage() {
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
  const { data: scents } = useQuery({
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
      console.log('Updating question:', id, data);
      return apiRequest('PUT', `/api/questions/${id}`, data)
        .then(res => res.json());
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
      return apiRequest('DELETE', `/api/questions/${id}`)
        .then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      toast({
        title: 'Success',
        description: 'Question deleted successfully',
      });
      setDeleteId(null);
    },
    onError: (error: any) => {
      console.error('Error in deleteQuestion:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to delete question: ${errorMsg}`,
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
        isMainQuestion: currentQuestion.isMainQuestion || false,
        parentId: currentQuestion.parentId || null,
        parentOptionId: currentQuestion.parentOptionId || null,
        options: currentQuestion.options,
        scaleMin: currentQuestion.scaleMin || '',
        scaleMax: currentQuestion.scaleMax || '',
        scaleSteps: currentQuestion.scaleSteps || 5
      } : {
        text: '',
        type: 'multiple_choice',
        order: questions ? questions.length + 1 : 1,
        isMainQuestion: false,
        parentId: null,
        parentOptionId: null,
        options: [{ id: `option_${Date.now()}`, text: '', description: '', scentMappings: {} }],
        scaleMin: '',
        scaleMax: '',
        scaleSteps: 5
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
    
    const updateOption = (index: number, field: string, value: any) => {
      const newOptions = [...options];
      newOptions[index][field] = value;
      setOptions(newOptions);
      form.setValue(`options.${index}.${field}`, value);
    };
    
    const updateScentMapping = (optionIndex: number, scentName: string, value: number) => {
      const newOptions = [...options];
      newOptions[optionIndex].scentMappings[scentName] = value;
      setOptions(newOptions);
      form.setValue('options', newOptions);
    };
    
    const onSubmit = (data: z.infer<typeof questionSchema>) => {
      // Pastikan data yang dikirim valid
      console.log('Form data to submit:', data);
      
      if (isEdit && currentQuestion) {
        updateQuestion.mutate({ id: currentQuestion.id, data });
      } else {
        createQuestion.mutate(data);
      }
    };

    // When type changes to rating_scale, update options accordingly
    const handleTypeChange = (type: string) => {
      form.setValue('type', type as any);
      
      if (type === 'rating_scale') {
        const steps = form.getValues('scaleSteps') || 5;
        const newOptions = [];
        for (let i = 1; i <= steps; i++) {
          newOptions.push({
            id: `option_${Date.now()}_${i}`,
            text: `${i}`,
            value: `${i}`,
            label: '',
            description: '',
            scentMappings: {}
          });
        }
        setOptions(newOptions);
        form.setValue('options', newOptions);
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
                    onValueChange={(value) => handleTypeChange(value)}
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
                      <SelectItem value="rating_scale">Rating Scale</SelectItem>
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
                          {questions?.filter(q => q.id !== (currentQuestion?.id || 0)).map(question => (
                            <SelectItem key={question.id} value={question.id.toString()}>
                              {question.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This question will show up as part of the branch from the parent question
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
                        <FormLabel>Parent Option</FormLabel>
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
                              <SelectItem key={option.id} value={option.id}>
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
          
          {/* Rating Scale Configuration */}
          {form.watch('type') === 'rating_scale' && (
            <div className="space-y-4 border p-4 rounded-md my-6 bg-gray-50">
              <h3 className="text-lg font-medium">Rating Scale Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="scale-min">Label Minimum</Label>
                  <Input
                    id="scale-min"
                    placeholder="Contoh: Tidak Sama Sekali"
                    value={form.getValues('scaleMin') || ''}
                    onChange={(e) => form.setValue('scaleMin', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="scale-max">Label Maximum</Label>
                  <Input
                    id="scale-max"
                    placeholder="Contoh: Sangat"
                    value={form.getValues('scaleMax') || ''}
                    onChange={(e) => form.setValue('scaleMax', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="scale-steps">Jumlah Skala</Label>
                  <Input
                    id="scale-steps"
                    type="number"
                    min="2"
                    max="10"
                    placeholder="5"
                    value={form.getValues('scaleSteps') || 5}
                    onChange={(e) => {
                      const steps = parseInt(e.target.value) || 5;
                      form.setValue('scaleSteps', steps);
                      
                      // Buat options otomatis berdasarkan jumlah langkah
                      const newOptions = [];
                      for (let i = 1; i <= steps; i++) {
                        newOptions.push({
                          id: `option_${Date.now()}_${i}`,
                          text: `${i}`,
                          value: `${i}`,
                          label: '',
                          description: '',
                          scentMappings: {}
                        });
                      }
                      setOptions(newOptions);
                      form.setValue('options', newOptions);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Options</Label>
              {form.watch('type') !== 'rating_scale' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Option
                </Button>
              )}
            </div>
            
            {options.map((option, index) => (
              <div key={option.id} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-start mb-2">
                  <Label className="text-sm font-medium">Option {index + 1}</Label>
                  {options.length > 1 && form.watch('type') !== 'rating_scale' && (
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
                  {form.watch('type') === 'rating_scale' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`option-value-${index}`}>Nilai</Label>
                        <Input
                          id={`option-value-${index}`}
                          value={option.value || (index + 1).toString()}
                          disabled={true}
                          className="bg-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Nilai ini ditetapkan secara otomatis</p>
                      </div>
                      <div>
                        <Label htmlFor={`option-label-${index}`}>Label (opsional)</Label>
                        <Input
                          id={`option-label-${index}`}
                          value={option.label || ''}
                          onChange={(e) => updateOption(index, 'label', e.target.value)}
                          placeholder="Label untuk titik rating ini"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`option-desc-${index}`}>Deskripsi (opsional)</Label>
                        <Input
                          id={`option-desc-${index}`}
                          value={option.description || ''}
                          onChange={(e) => updateOption(index, 'description', e.target.value)}
                          placeholder="Ditampilkan saat titik ini dipilih"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor={`option-text-${index}`}>Text</Label>
                        <Input
                          id={`option-text-${index}`}
                          value={option.text}
                          onChange={(e) => {
                            updateOption(index, 'text', e.target.value);
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
                            updateOption(index, 'description', e.target.value);
                          }}
                          placeholder="Description for this option"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Scent Mappings</Label>
                  <p className="text-sm text-gray-500">
                    Set how strongly this option maps to each scent
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {scents && scents.map((scent: any) => (
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
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createQuestion.isPending || updateQuestion.isPending}>
              {(createQuestion.isPending || updateQuestion.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isEdit ? 'Update' : 'Create'} Question
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  return (
    <>
      <Helmet>
        <title>Fordive Admin - Questions</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="flex items-center mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Questions Management</h1>
            <p className="text-gray-500">
              Create and manage quiz questions
            </p>
          </div>
          <Link href="/admin">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin
            </Button>
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Questions</h2>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Question
            </Button>
          </div>
          
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load questions. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{question.id}</TableCell>
                      <TableCell>{question.text}</TableCell>
                      <TableCell>
                        <span className="capitalize">{question.type.replace('_', ' ')}</span>
                      </TableCell>
                      <TableCell>{question.order}</TableCell>
                      <TableCell>
                        {question.isMainQuestion ? (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Main</span>
                        ) : question.parentId ? (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Child</span>
                        ) : (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Standard</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentQuestion(question);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(question.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardHeader className="text-center">
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
      
      {/* Add Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Create a new question for the quiz. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <QuestionForm onClose={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Update the details of this question.
            </DialogDescription>
          </DialogHeader>
          <QuestionForm 
            isEdit 
            onClose={() => {
              setIsEditDialogOpen(false);
              setCurrentQuestion(null);
            }} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteId && deleteQuestion.mutate(deleteId)}
              disabled={deleteQuestion.isPending}
            >
              {deleteQuestion.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}