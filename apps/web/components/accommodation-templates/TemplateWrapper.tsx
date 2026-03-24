"use client";

import { AccommodationData, TemplateStyle } from "./types";
import ModernTemplate from "./modern";
import ClassicTemplate from "./classic";
import LuxuryTemplate from "./luxury";

interface TemplateWrapperProps {
    accommodation: AccommodationData;
    onBook?: () => void;
}

export default function TemplateWrapper({ accommodation, onBook }: TemplateWrapperProps) {
    const templateStyle = (accommodation.template_style as TemplateStyle) || "modern";

    const handleBook = onBook || (() => {});

    switch (templateStyle) {
        case "luxury":
            return <LuxuryTemplate accommodation={accommodation} onBook={handleBook} />;
        case "classic":
            return <ClassicTemplate accommodation={accommodation} onBook={handleBook} />;
        case "modern":
        default:
            return <ModernTemplate accommodation={accommodation} onBook={handleBook} />;
    }
}
