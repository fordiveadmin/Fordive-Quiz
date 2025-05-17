import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getImageOptionsForAdmin } from '@/data/moodImages';
import { X } from 'lucide-react';

interface ImagePreferenceHelpProps {
  onInsert: (options: any[]) => void;
}

export default function ImagePreferenceHelp({ onInsert }: ImagePreferenceHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const moodOptions = getImageOptionsForAdmin();
  
  const handleInsert = () => {
    onInsert(moodOptions);
    setIsOpen(false);
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="mt-2 text-sm"
      >
        Suggestion: Insert Mood Image Samples
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Insert Sample Mood Images</DialogTitle>
            <DialogDescription>
              These sample mood images help users express their preferences and will provide data for scent mapping.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {moodOptions.map(option => (
              <div key={option.id} className="border rounded-md p-3 flex flex-col gap-2">
                <div className="aspect-video relative overflow-hidden rounded-md mb-2">
                  <img src={option.imageUrl} alt={option.text} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-medium">{option.text}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-500 my-4">
            These images include predefined scent mappings that help generate personalized recommendations based on
            user preferences. When users select an image, they're indirectly expressing preference for certain scent profiles.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleInsert}>Insert All Samples</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}