import { Hammer } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="p-4 bg-slate-100 rounded-full text-slate-400">
        <Hammer size={48} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-slate-900">Storage Providers</h1>
        <p className="text-slate-500 max-w-md mx-auto mt-2">
          Deze module wordt momenteel geconfigureerd. In de volgende stap koppelen we hier de database tabellen aan.
        </p>
      </div>
    </div>
  );
}
