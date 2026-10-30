export type PageTypographyProps = {
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export type LandingPageCustomization = {
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export function splitTypographyProps<T extends PageTypographyProps>(
  props: T,
): [PageTypographyProps, Omit<T, keyof PageTypographyProps>] {
  const {
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    primaryColor,
    headingSize,
    bodySize,
    headingLetterSpacing,
    ...rest
  } = props;
  return [
    {
      headingFont,
      bodyFont,
      headingWeight,
      bodyWeight,
      primaryColor,
      headingSize,
      bodySize,
      headingLetterSpacing,
    },
    rest as Omit<T, keyof PageTypographyProps>,
  ];
}

export function usePageTypography(
  base: Record<string, unknown>,
  custom?: PageTypographyProps,
): LandingPageCustomization {
  return {
    ...base,
    ...custom,
  };
}

export function applyPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization,
) {
  if (!frame || !frame.contentDocument || !customization) return;
  const doc = frame.contentDocument;
  const styleId = "threeui-customization-style";
  let styleEl = doc.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = doc.createElement("style");
    styleEl.id = styleId;
    doc.head.appendChild(styleEl);
  }

  const rootVars: string[] = [];
  const rules: string[] = [];

  if (customization.primaryColor) {
    rootVars.push(`--accent: ${customization.primaryColor} !important;`);
  }
  if (customization.headingFont) {
    const fontVal = customization.headingFont.toLowerCase().includes("iowan")
      ? '"Iowan Old Style", "Baskerville", serif'
      : customization.headingFont;
    rootVars.push(`--serif: ${fontVal} !important;`);
  }
  if (customization.bodyFont) {
    const monoVal = customization.bodyFont.toLowerCase().includes("inter")
      ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
      : customization.bodyFont;
    rootVars.push(`--mono: ${monoVal} !important;`);
  }

  if (customization.headingSize) {
    rules.push(`.selection__title, .detail-title { font-size: ${customization.headingSize}px !important; }`);
  }
  if (customization.headingLetterSpacing !== undefined) {
    rules.push(`.selection__title, .detail-title { letter-spacing: ${customization.headingLetterSpacing}em !important; }`);
  }
  if (customization.headingWeight) {
    rules.push(`.selection__title, .detail-title { font-weight: ${customization.headingWeight} !important; }`);
  }
  if (customization.bodyWeight) {
    rules.push(`.selection__note, .detail-body, .eyebrow, .counter, .issue { font-weight: ${customization.bodyWeight} !important; }`);
  }
  if (customization.bodySize) {
    rules.push(`.selection__note, .detail-body { font-size: ${customization.bodySize}px !important; }`);
  }

  styleEl.textContent = `
    :root {
      ${rootVars.join("\n      ")}
    }
    ${rules.join("\n    ")}
  `;
}

export function postPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization,
) {
  if (!frame || !frame.contentWindow || !customization) return;
  try {
    frame.contentWindow.postMessage(
      { type: "threeui:customization", payload: customization },
      "*",
    );
  } catch {
    // Ignore cross-origin postMessage warnings if any
  }
}

