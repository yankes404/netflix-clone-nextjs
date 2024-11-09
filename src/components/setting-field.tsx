interface Props {
    label: string;
    children: React.ReactNode;
}

export const SettingField = ({
    label,
    children
}: Props) => {
    return (
        <div className="w-full py-4 border-b last:border-none flex items-center justify-between gap-x-4">
            <p className="font-semibold shrink-0">
                {label}
            </p>
            {children}
        </div>
    )
}