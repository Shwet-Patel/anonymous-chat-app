import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";

type UrlBoxProps = {
  title: string; // Title of the URL box
  url: string; // URL to be displayed and copied
  disabled?: boolean; // Optional prop to disable the copy button
};

function UrlBox({ title, url, disabled = false }: UrlBoxProps) {
  //copy to clipboard
  const [copiedText, copy] = useCopyToClipboard();
  const CopyToClipboard = () => {
    copy(url)
      .then(() => {
        toast.success("copied to clipboard");
      })
      .catch((error) => {
        toast.error(`can't copy to clipboard, url: ` + `${copiedText}`, error);
      });
  };
  return (
    <div className="">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm bg-gray-50 disabled:text-gray-500 focus:outline-none"
          value={url}
          disabled={disabled}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={CopyToClipboard}
          className="bg-sky-950 text-white px-4 py-2 rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default UrlBox;
