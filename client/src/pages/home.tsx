import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import RegistrationForm from "@/components/registration-form";
import schoolImage from "@assets/IMG_20250627_141514660_1751260346213.jpg";
import logoImage from "@assets/images (4)_1751262564527.jpeg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="Prodigy Public School Logo" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <h1 className="text-xl font-bold text-foreground">Prodigy MUN 2025</h1>
            </div>
            <Link href="/admin-login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Shield className="mr-1 h-4 w-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* School Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src={schoolImage} 
                alt="Prodigy Public School Building" 
                className="mx-auto rounded-lg shadow-md max-w-md w-full object-cover h-64"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Model United Nations 2025
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Prodigy Public School, Wagholi - Pune
            </p>
            <p className="text-sm text-muted-foreground">
              Delegate Registration Portal
            </p>
          </div>

          {/* Registration Form */}
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
