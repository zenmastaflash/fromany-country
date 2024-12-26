import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function UITest() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-fac-text">Buttons</h2>
        <div className="space-x-4">
          <Button>Default Button</Button>
          <Button className="bg-fac-accent">Accent Button</Button>
          <Button className="bg-fac-primary">Primary Button</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-fac-text">Cards</h2>
        <Card>
          <h2 className="text-lg font-semibold p-4">Card Title</h2>
          <p className="p-4 pt-0">Card content goes here</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-fac-text">Inputs</h2>
        <Input 
          placeholder="Type something..."
          className="max-w-md"
        />
      </div>
    </div>
  );
}
