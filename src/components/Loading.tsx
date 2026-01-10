import { Loader2 } from 'lucide-react';

const Loading = ({ text }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <Loader2 size={32} className="animate-spin mb-3 text-brand" />
      <p className="text-sm font-medium">{text ? text : 'Please wait...'}</p>
    </div>
  );
};

export default Loading;
