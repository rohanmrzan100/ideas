import { Loader2 } from 'lucide-react';

export default function SectionLoader() {
  return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand" />
    </div>
  );
}
