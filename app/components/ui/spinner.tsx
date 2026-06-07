import { LoaderCircle } from "lucide-react";

export default function Spinner({ size = 16 }: { size?: number }) {
    return <LoaderCircle size={size} className="animate-spin" />;
}
