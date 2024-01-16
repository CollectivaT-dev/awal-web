import { Loader2 } from "lucide-react";


const Loader = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <span>
                <Loader2 className="text-clay-700 animate-spin " size={80} />
            </span>
        </div>
    );
};
export default Loader;
