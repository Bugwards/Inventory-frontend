import { CheckCircle } from "lucide-react";

interface Props {
  message: string;
  onOk: () => void;
}

export default function SuccessModal({ message, onOk }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle size={32} className="text-green-600" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Saved Successfully
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          {message}
        </p>

        <button
          type="button"
          onClick={onOk}
          className="mt-5 w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"
        >
          OK
        </button>
      </div>
    </div>
  );
}