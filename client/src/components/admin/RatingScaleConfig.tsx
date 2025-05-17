import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RatingScaleConfigProps {
  form: UseFormReturn<any>;
  options: any[];
  setOptions: (options: any[]) => void;
}

export default function RatingScaleConfig({ form, options, setOptions }: RatingScaleConfigProps) {
  // Update options when scale steps change
  const updateOptionsForSteps = (steps: number) => {
    const newOptions = [];
    for (let i = 1; i <= steps; i++) {
      // Preserve existing options when possible
      if (i <= options.length) {
        const existingOption = {...options[i-1]};
        existingOption.value = i.toString();
        existingOption.text = i.toString(); // Ensure text is also set for compatibility
        newOptions.push(existingOption);
      } else {
        newOptions.push({
          id: `option_${Date.now()}_${i}`,
          value: i.toString(),
          text: i.toString(),
          label: '',
          description: '',
          scentMappings: {}
        });
      }
    }
    setOptions(newOptions);
    form.setValue('options', newOptions);
  };

  // Initialize options with default 5 steps if needed
  useEffect(() => {
    if (form.getValues('type') === 'rating_scale' && (!options || options.length === 0)) {
      updateOptionsForSteps(5);
    }
  }, []);

  return (
    <div className="border rounded-md p-4 space-y-4 mb-6 bg-gray-50">
      <h3 className="text-lg font-medium">Rating Scale Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="scale-min">Minimum Label</Label>
          <Input
            id="scale-min"
            placeholder="e.g. Not at all"
            value={form.watch('scaleMin') || ''}
            onChange={(e) => form.setValue('scaleMin', e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Label for the minimum end of the scale</p>
        </div>
        <div>
          <Label htmlFor="scale-max">Maximum Label</Label>
          <Input
            id="scale-max"
            placeholder="e.g. Very much"
            value={form.watch('scaleMax') || ''}
            onChange={(e) => form.setValue('scaleMax', e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Label for the maximum end of the scale</p>
        </div>
        <div>
          <Label htmlFor="scale-steps">Number of Steps</Label>
          <Input
            id="scale-steps"
            type="number"
            min="2"
            max="10"
            placeholder="5"
            value={form.watch('scaleSteps') || 5}
            onChange={(e) => {
              const steps = parseInt(e.target.value) || 5;
              form.setValue('scaleSteps', steps);
              updateOptionsForSteps(steps);
            }}
          />
          <p className="text-xs text-gray-500 mt-1">How many points on the scale (2-10)</p>
        </div>
      </div>
    </div>
  );
}