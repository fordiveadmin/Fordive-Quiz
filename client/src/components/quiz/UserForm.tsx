import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/quizStore";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  birthDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true; // Optional field
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return dateRegex.test(date);
    }, { message: "Please enter a valid date in YYYY-MM-DD format" }),
  subscribeToNewsletter: z.boolean().default(false),
});

export default function UserForm() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const setUser = useStore(state => state.setUser);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      subscribeToNewsletter: false,
    },
  });
  
  const createUser = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/users", data);
      return res.json();
    },
    onSuccess: (data) => {
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      });
      navigate("/quiz");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to register: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    createUser.mutate(values);
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md"
      >
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-foreground">Let's Get Started</h2>
          <p className="mt-2 text-muted-foreground">Tell us a bit about yourself before we begin</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name" 
                        {...field} 
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        {...field} 
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </FormControl>
                    <p className="mt-1 text-xs text-muted-foreground">
                      We'll send your scent results to this email
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </FormControl>
                    <p className="mt-1 text-xs text-muted-foreground">
                      We'll use this to determine your zodiac sign for personalized recommendations
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="subscribeToNewsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I'd like to receive fragrance tips<br />and exclusive offers
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-accent text-white font-medium py-3 px-4 rounded-full shadow-sm transition duration-300"
              disabled={createUser.isPending}
            >
              {createUser.isPending ? "Submitting..." : "Start the Quiz"}
            </Button>
            
            <div className="text-center text-xs text-muted-foreground">
              <p>
                By continuing, you agree to our<br />
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
