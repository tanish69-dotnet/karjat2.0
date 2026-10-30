"use client";

import {
  splitTypographyProps,
  usePageTypography,
  type PageTypographyProps,
} from "./pageTypography";
import { LandingPageFrame, type LandingPageProps } from "./LandingPageFrame";
import "./threeui.css";

export const COMPLETE_SHELF_TYPOGRAPHY = {
  headingFont: "iowan-old-style",
  bodyFont: "inter",
  headingWeight: 400,
  bodyWeight: 400,
  primaryColor: "#c87046",
  headingSize: 60,
  bodySize: 12,
  headingLetterSpacing: -0.055,
};

export function CompleteShelfLandingPage(props: LandingPageProps & PageTypographyProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(COMPLETE_SHELF_TYPOGRAPHY, type);
  return (
    <LandingPageFrame
      {...frame}
      customization={customization}
      title="Working Volumes — Seven Tools for Making"
      sourceUrl="/landing-pages/complete-shelf-v2.html"
    />
  );
}

export default CompleteShelfLandingPage;

