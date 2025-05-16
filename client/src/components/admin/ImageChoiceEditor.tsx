import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Option {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  scentMappings: Record<string, number>;
}

interface ImageChoiceEditorProps {
  options: Option[];
  onChange: (options: Option[]) => void;
  scents: { id: number; name: string }[];
}

export default function ImageChoiceEditor({ options, onChange, scents }: ImageChoiceEditorProps) {
  // Update option properties
  const updateOption = (index: number, field: keyof Option, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange(newOptions);
  };

  // Update scent mapping values
  const updateScentMapping = (index: number, scentId: number, value: number) => {
    const newOptions = [...options];
    newOptions[index] = { 
      ...newOptions[index], 
      scentMappings: { 
        ...newOptions[index].scentMappings, 
        [scentId]: value 
      } 
    };
    onChange(newOptions);
  };

  // Add a new option
  const addOption = () => {
    const newOption: Option = {
      id: `option_${Date.now()}`,
      text: '',
      description: '',
      imageUrl: '',
      backgroundColor: '#F2ECE3',
      textColor: '#1E293B',
      scentMappings: {}
    };
    
    // Initialize scent mappings with 0 values
    scents.forEach(scent => {
      newOption.scentMappings[scent.id] = 0;
    });
    
    onChange([...options, newOption]);
  };

  // Remove an option
  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    onChange(newOptions);
  };

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <div key={option.id} className="border p-4 rounded-md mb-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium">Option {index + 1}</h3>
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
                onChange={(e) => updateOption(index, 'text', e.target.value)}
                placeholder="Option text"
              />
            </div>
            
            <div>
              <Label htmlFor={`option-description-${index}`}>Description (optional)</Label>
              <Textarea
                id={`option-description-${index}`}
                value={option.description || ''}
                onChange={(e) => updateOption(index, 'description', e.target.value)}
                placeholder="Add a short description for this option"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor={`option-image-${index}`}>Image URL (optional)</Label>
              <Input
                id={`option-image-${index}`}
                value={option.imageUrl || ''}
                onChange={(e) => updateOption(index, 'imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`option-bg-${index}`}>Background Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id={`option-bg-${index}`}
                    type="color"
                    value={option.backgroundColor || '#F2ECE3'}
                    onChange={(e) => updateOption(index, 'backgroundColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={option.backgroundColor || '#F2ECE3'}
                    onChange={(e) => updateOption(index, 'backgroundColor', e.target.value)}
                    placeholder="#F2ECE3"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`option-text-color-${index}`}>Text Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id={`option-text-color-${index}`}
                    type="color"
                    value={option.textColor || '#1E293B'}
                    onChange={(e) => updateOption(index, 'textColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={option.textColor || '#1E293B'}
                    onChange={(e) => updateOption(index, 'textColor', e.target.value)}
                    placeholder="#1E293B"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Scent Mappings</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scents.map(scent => (
                <div key={scent.id} className="flex items-center space-x-3">
                  <Label htmlFor={`scent-${scent.id}-option-${index}`} className="w-28 truncate">
                    {scent.name}:
                  </Label>
                  <Input
                    id={`scent-${scent.id}-option-${index}`}
                    type="number"
                    min="0"
                    max="10"
                    value={option.scentMappings[scent.id] || 0}
                    onChange={(e) => updateScentMapping(index, scent.id, parseInt(e.target.value) || 0)}
                    className="w-16"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addOption}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Another Option
      </Button>
    </div>
  );
}