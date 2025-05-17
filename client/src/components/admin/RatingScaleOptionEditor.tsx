import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RatingScaleOptionEditorProps {
  option: any;
  index: number;
  updateOption: (index: number, field: string, value: any) => void;
  updateScentMapping: (optionIndex: number, scentName: string, value: number) => void;
  scents: any[];
}

export default function RatingScaleOptionEditor({ 
  option, 
  index, 
  updateOption, 
  updateScentMapping,
  scents 
}: RatingScaleOptionEditorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`option-value-${index}`}>Scale Value</Label>
        <Input
          id={`option-value-${index}`}
          value={option.value || (index + 1).toString()}
          disabled={true}
          className="bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">This value is automatically set</p>
      </div>
      <div>
        <Label htmlFor={`option-label-${index}`}>Option Label (optional)</Label>
        <Input
          id={`option-label-${index}`}
          value={option.label || ''}
          onChange={(e) => updateOption(index, 'label', e.target.value)}
          placeholder="Label for this rating point"
        />
        <p className="text-xs text-gray-500 mt-1">Short text displayed below each rating point</p>
      </div>
      
      <div className="md:col-span-2">
        <Label htmlFor={`option-desc-${index}`}>Description (optional)</Label>
        <Input
          id={`option-desc-${index}`}
          value={option.description || ''}
          onChange={(e) => updateOption(index, 'description', e.target.value)}
          placeholder="Displayed when this point is selected"
        />
      </div>
      
      <div className="md:col-span-2">
        <Label className="mb-2 block">Scent Mappings</Label>
        <div className="grid grid-cols-2 gap-2">
          {scents && scents.map((scent) => (
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
  );
}