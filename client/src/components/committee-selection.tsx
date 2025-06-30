import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Flag, Globe } from "lucide-react";
import { getIndianCommittees, getInternationalCommittees, type Committee } from "@/lib/committees";

interface CommitteeSelectionProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function CommitteeSelection({ value, onValueChange }: CommitteeSelectionProps) {
  const indianCommittees = getIndianCommittees();
  const internationalCommittees = getInternationalCommittees();

  const CommitteeCard = ({ committee }: { committee: Committee }) => (
    <div className="committee-option">
      <Label
        htmlFor={committee.id}
        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
          committee.category === 'indian' 
            ? 'indian-committee hover:border-secondary' 
            : 'international-committee hover:border-primary'
        } ${
          value === committee.id 
            ? committee.category === 'indian' 
              ? 'border-secondary bg-secondary/10' 
              : 'border-primary bg-primary/10'
            : ''
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
        
        <RadioGroup value={value} onValueChange={onValueChange} className="space-y-6">
          {/* Indian Committees */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center">
              <Flag className="mr-2 h-5 w-5" />
              Indian Committees
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {indianCommittees.map((committee) => (
                <CommitteeCard key={committee.id} committee={committee} />
              ))}
            </div>
          </div>

          {/* International Committees */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              International Committees
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {internationalCommittees.map((committee) => (
                <CommitteeCard key={committee.id} committee={committee} />
              ))}
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
