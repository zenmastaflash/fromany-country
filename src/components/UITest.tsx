import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';

export default function UITest() {
  return (
    <div className="space-y-12 p-8 bg-background">
      {/* Color Palette Showcase */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Color Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-md"></div>
            <p className="text-text">Primary (#0FA4AF)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-secondary rounded-md"></div>
            <p className="text-text">Secondary (#024950)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-secondary-dark rounded-md"></div>
            <p className="text-text">Secondary Dark (#003135)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-accent rounded-md"></div>
            <p className="text-text">Accent (#964734)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-md" style={{ backgroundColor: '#AFDDE5' }}></div>
            <p className="text-text">Link (#AFDDE5)</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Buttons</h2>
        <div className="space-x-4">
          <Button className="btn-primary">Primary Button</Button>
          <Button className="btn-secondary">Secondary Button</Button>
          <Button className="bg-accent text-text">Accent Button</Button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="card">
            <h3 className="text-lg font-semibold text-text mb-2">Default Card</h3>
            <p className="text-link">Card content with link-colored text</p>
            <a href="#" className="link mt-2 block">Example Link</a>
          </Card>
          
          <Card className="bg-secondary border border-border">
            <h3 className="text-lg font-semibold text-text mb-2">Secondary Card</h3>
            <p className="text-link">Card with secondary background</p>
            <div className="mt-2">
              <span className="bg-accent text-text px-2 py-1 rounded text-sm">Accent Label</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Form Elements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Form Elements</h2>
        <div className="space-y-4 max-w-md">
          <Input 
            placeholder="Default Input"
            className="w-full"
          />
          <Input 
            placeholder="Disabled Input"
            disabled
            className="w-full"
          />
          <div className="alert">
            This is an alert message using accent color
          </div>
        </div>
      </div>

      {/* Links and Text */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Typography</h2>
        <div className="space-y-2">
          <p className="text-text">Default text color</p>
          <p className="text-link">Link-colored text</p>
          <a href="#" className="link">Clickable Link</a>
          <p className="text-sm text-link">Small text with link color</p>
        </div>
      </div>
    </div>
  );
}
