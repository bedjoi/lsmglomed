import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva("w-full rounded-md p-4 flex items-start border", {
    variants: {
        variant: {
            default: "bg-primary/10 border-primary text-primary",
            success: "bg-green-50 border-green-500 text-green-700",
            error: "bg-red-50 border-red-500 text-red-700",
            warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
            info: "bg-blue-50 border-blue-400 text-blue-700",
        },
    },
    defaultVariants: {
        variant: "warning",
    },
});

const icons = {
    default: Info,
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label?: string;
    className?: string;
}

export const Banner = ({
    variant,
    label,
    className,
    ...props
}: BannerProps) => {
    const Icon = icons[variant || "warning"];
    return (
        <div className={cn(bannerVariants({ variant }), className)} {...props}>
            <Icon className="h-4 w-4 mr-2" />
            {label && <span className="font-medium">{label}</span>}
        </div>
    );
};
