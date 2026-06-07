import Spinner from "~/components/ui/spinner";

export default function Loader() {
    return(
        <div className="w-full h-full flex gap-2 items-center justify-center">
            <Spinner />
            <span>Завантаження...</span>
        </div>
    )
}