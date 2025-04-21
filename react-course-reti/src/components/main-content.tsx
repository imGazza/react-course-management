import React from "react";

interface MainContentProps {
    children: React.ReactNode
}

const MainContent = React.memo(({ children }: MainContentProps) => (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {children}
            </div>
        </div>
    </div>
));
export default MainContent;