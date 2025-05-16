import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Upload, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  const [editedOptions, setEditedOptions] = useState<Option[]>(options);
  
  useEffect(() => {
    setEditedOptions(options);
  }, [options]);
  
  const handleAddOption = () => {
    const newOption: Option = {
      id: `option_${Date.now()}`,
      text: '',
      description: '',
      backgroundColor: '#F2ECE3',
      textColor: '#333333',
      scentMappings: {}
    };
    
    setEditedOptions([...editedOptions, newOption]);
    onChange([...editedOptions, newOption]);
  };
  
  const handleRemoveOption = (id: string) => {
    const updated = editedOptions.filter(opt => opt.id !== id);
    setEditedOptions(updated);
    onChange(updated);
  };
  
  const handleOptionChange = (id: string, field: keyof Option, value: any) => {
    const updated = editedOptions.map(opt => {
      if (opt.id === id) {
        if (field === 'scentMappings') {
          // Handle special case for scent mappings
          return { ...opt, scentMappings: { ...opt.scentMappings, ...value } };
        }
        return { ...opt, [field]: value };
      }
      return opt;
    });
    
    setEditedOptions(updated);
    onChange(updated);
  };
  
  const handleScentScoreChange = (optionId: string, scentId: number, score: number) => {
    const scentIdStr = scentId.toString();
    handleOptionChange(optionId, 'scentMappings', { [scentIdStr]: score });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {editedOptions.map((option, index) => (
          <Card key={option.id} className="relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-1 h-full" 
              style={{ backgroundColor: option.backgroundColor || '#F2ECE3' }}
            />
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Option {index + 1}</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveOption(option.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`option-text-${option.id}`}>Option Text</Label>
                    <Input
                      id={`option-text-${option.id}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`option-desc-${option.id}`}>Description (Optional)</Label>
                    <Textarea
                      id={`option-desc-${option.id}`}
                      value={option.description || ''}
                      onChange={(e) => handleOptionChange(option.id, 'description', e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`option-image-${option.id}`}>Image URL</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id={`option-image-${option.id}`}
                        value={option.imageUrl || ''}
                        onChange={(e) => handleOptionChange(option.id, 'imageUrl', e.target.value)}
                        placeholder="https://example.com/image.png"
                      />
                      <Button variant="outline" size="icon" type="button">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`option-bg-${option.id}`}>Background Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id={`option-bg-${option.id}`}
                        value={option.backgroundColor || '#F2ECE3'}
                        onChange={(e) => handleOptionChange(option.id, 'backgroundColor', e.target.value)}
                        className="flex-1"
                      />
                      <input
                        type="color"
                        value={option.backgroundColor || '#F2ECE3'}
                        onChange={(e) => handleOptionChange(option.id, 'backgroundColor', e.target.value)}
                        className="w-10 h-10 cursor-pointer border rounded"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`option-text-color-${option.id}`}>Text Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id={`option-text-color-${option.id}`}
                        value={option.textColor || '#333333'}
                        onChange={(e) => handleOptionChange(option.id, 'textColor', e.target.value)}
                        className="flex-1"
                      />
                      <input
                        type="color"
                        value={option.textColor || '#333333'}
                        onChange={(e) => handleOptionChange(option.id, 'textColor', e.target.value)}
                        className="w-10 h-10 cursor-pointer border rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-1">
                    <Label>Preview</Label>
                    <div 
                      className="mt-1 p-4 rounded-lg flex flex-col items-center"
                      style={{ 
                        backgroundColor: option.backgroundColor || '#F2ECE3',
                        color: option.textColor || '#333333'
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2">
                        {option.imageUrl ? (
                          <img 
                            src={option.imageUrl} 
                            alt={option.text} 
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xNC41IDRoLTVMNyA3SDRhMiAyIDAgMCAwLTIgMnY5YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMlY5YTIgMiAwIDAgMC0yLTJoLTNsLTIuNS0zeiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTMiIHI9IjMiLz48L3N2Zz4=';
                            }}
                          />
                        ) : (
                          <Image className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <span className="font-medium text-center">
                        {option.text || 'Option Text'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Scent Mappings</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {scents.map(scent => (
                    <div key={scent.id} className="flex items-center space-x-2">
                      <Label htmlFor={`scent-${option.id}-${scent.id}`} className="min-w-32 text-sm">
                        {scent.name}
                      </Label>
                      <Input
                        id={`scent-${option.id}-${scent.id}`}
                        type="number"
                        min="0"
                        max="10"
                        value={option.scentMappings[scent.id] || 0}
                        onChange={(e) => handleScentScoreChange(
                          option.id, 
                          scent.id, 
                          parseInt(e.target.value) || 0
                        )}
                        className="w-20"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAddOption}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Option
      </Button>
    </div>
  );
}