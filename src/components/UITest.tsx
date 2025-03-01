import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import BackgroundTest from './BackgroundTest';
import TaxAdvisorTest from './TaxAdvisorTest';

export default function UITest() {
  return (
    <div className="space-y-12 p-8">
      {/* Tax Advisor Test */}
      <TaxAdvisorTest />

      {/* Background Tests */}
      <BackgroundTest />

      {/* Color Palette */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Background Colors */}
          <div className="space-y-2">
            <div className="h-20 bg-background rounded-md"></div>
            <p className="text-text">Background</p>
            <p className="text-sm text-link">#2E2E2E</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-md"></div>
            <p className="text-text">Primary</p>
            <p className="text-sm text-link">#0FA4AF</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-secondary rounded-md"></div>
            <p className="text-text">Secondary</p>
            <p className="text-sm text-link">#024950</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-accent rounded-md"></div>
            <p className="text-text">Accent</p>
            <p className="text-sm text-link">#964734</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-secondary-dark rounded-md"></div>
            <p className="text-text">Secondary Dark</p>
            <p className="text-sm text-link">#003135</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Button variant="primary">
              Primary Button
            </Button>
            <p className="text-sm text-link">#0FA4AF with #AFDDE5 hover</p>
          </div>
          
          <div className="space-y-2">
            <Button variant="secondary">
              Secondary Button
            </Button>
            <p className="text-sm text-link">#024950 with #003135 hover</p>
          </div>
          
          <div className="space-y-2">
            <Button variant="accent">
              Accent Button
            </Button>
            <p className="text-sm text-link">#964734 with #0FA4AF hover</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="card">
            <h3 className="text-lg font-semibold text-text">Default Card</h3>
            <p className="text-link mt-2">This is a default card with link-colored text.</p>
            <Button className="btn-primary mt-4">Card Action</Button>
          </Card>

          <Card className="bg-secondary border border-border">
            <h3 className="text-lg font-semibold text-text">Secondary Card</h3>
            <p className="text-link mt-2">A card with secondary background.</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 text-xs font-semibold rounded bg-primary text-text">
                Tag 1
              </span>
              <span className="px-2 py-1 text-xs font-semibold rounded bg-accent text-text">
                Tag 2
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Form Elements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Form Elements</h2>
        <div className="max-w-md space-y-4">
          <Input 
            placeholder="Default input field"
            className="w-full"
          />
          <select className="w-full rounded-md border-border bg-secondary text-text p-2">
            <option value="">Select an option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </select>
        </div>
      </div>

      {/* Status Flags */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Status Flags</h2>
        <div className="flex gap-4">
          <span className="px-2 py-1 text-xs font-semibold rounded bg-primary text-text">
            active
          </span>
          <span className="px-2 py-1 text-xs font-semibold rounded bg-accent text-text">
            expired
          </span>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-text">Heading 1</h1>
            <h2 className="text-3xl font-bold text-text">Heading 2</h2>
            <h3 className="text-2xl font-bold text-text">Heading 3</h3>
            <h4 className="text-xl font-bold text-text">Heading 4</h4>
          </div>
          <div className="space-y-2">
            <p className="text-text">Regular text in primary text color</p>
            <p className="text-link">Secondary text in link color</p>
            <a href="#" className="text-link hover:text-primary">Clickable link with hover state</a>
          </div>
        </div>
      </div>
    </div>
  );
}
