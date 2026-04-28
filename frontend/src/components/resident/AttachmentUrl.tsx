import { useState } from "react";

type Props = {
  attachmentUrls: string[];
  onChange?: (urls: string[]) => void;
};

const AttachmentUrl = ({ attachmentUrls, onChange }: Props) => {
  const [data, setData] = useState<string[]>(attachmentUrls);
  const [url, setUrl] = useState("");
  const handleAdd = () => {
    if (data.length >= 5) return;
    const newData = [...data, url];
    setData(newData);
    onChange?.(newData);
    setUrl("");
  };
  const handleRemove = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    onChange?.(newData);
  };
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between">
        <label className="text-sm font-semibold text-slate-700">
          Hình ảnh đính kèm
        </label>
        <span className="text-xs text-slate-500">
          {/* {attachmentUrls.length}/5 ảnh */}
        </span>
      </div>
      <div className="flex justify-between">
        <input
          maxLength={200}
          placeholder="VD: https://example.com/image.jpg"
          type="text"
          className="w-full h-12 pl-4 pr-10 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300focus:outline-none focus:ring-2 focus:ring-primary/30  focus:border-primary appearance-none cursor-pointer"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="ml-3 px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all active:scale-95"
        >
          Thêm
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-3">
        {/* Preview */}
        {data.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden border border-slate-100"
          >
            <img src={url} className="w-full h-full object-cover" />

            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500 italic">Tối đa 5 ảnh (URL).</p>
    </div>
  );
};

export default AttachmentUrl;
