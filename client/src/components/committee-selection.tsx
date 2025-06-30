import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { committees, type Committee } from "@/lib/committees";

interface CommitteeSelectionProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function CommitteeSelection({ value, onValueChange }: CommitteeSelectionProps) {
  const CommitteeCard = ({ committee }: { committee: Committee }) => (
    <div className="committee-option">
      <Label
        htmlFor={committee.id}
        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary ${
          value === committee.id 
            ? 'border-primary bg-primary/10'
            : 'border-border bg-card'
        }`}
      >
        <RadioGroupItem value={committee.id} id={committee.id} className="mr-3" />
        <div className="flex-1">
          <span className="font-medium text-foreground block">{committee.name}</span>
          <p className="text-sm text-muted-foreground mt-1">{committee.description}</p>
        </div>
      </Label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Please select ONE committee that you would like to participate in:
        </p>
        
        <RadioGroup value={value} onValueChange={onValueChange} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Available Committees
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {committees.map((committee) => (
                <CommitteeCard key={committee.id} committee={committee} />
              ))}
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
