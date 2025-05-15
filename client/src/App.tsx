import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import AdminIndex from "@/pages/admin/index";
import AdminQuestions from "@/pages/admin/questions";
import AdminScents from "@/pages/admin/scents";
import AdminZodiac from "@/pages/admin/zodiac";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminLogin from "@/pages/admin/login";
import AdminSettings from "@/pages/admin/settings";
import { Toaster } from "@/components/ui/toaster";
import { motion, AnimatePresence } from "framer-motion";
import PrivateRoute from "@/components/admin/PrivateRoute";

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/results" component={Results} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={() => <PrivateRoute component={AdminIndex} />} />
          <Route path="/admin/questions" component={() => <PrivateRoute component={AdminQuestions} />} />
          <Route path="/admin/scents" component={() => <PrivateRoute component={AdminScents} />} />
          <Route path="/admin/zodiac" component={() => <PrivateRoute component={AdminZodiac} />} />
          <Route path="/admin/analytics" component={() => <PrivateRoute component={AdminAnalytics} />} />
          <Route path="/admin/settings" component={() => <PrivateRoute component={AdminSettings} />} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatedRoutes />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
