export function validateTemplateConfig({
  templateName,
  blockNames = [],
  metadata,
}) {
  const warnings = [];
  const errors = [];
  const template = metadata?.[templateName];

  if (!templateName) {
    return {
      valid: true,
      warnings,
      errors,
    };
  }

  if (!template) {
    errors.push(`[Motion System] Unknown template "${templateName}".`);

    return {
      valid: false,
      warnings,
      errors,
    };
  }

  if (blockNames.length === 0) {
    warnings.push(
      `[Motion System] Template "${templateName}" has no declared data-template-block elements.`
    );
  }

  template.requiredBlocks.forEach((requiredBlock) => {
    if (!blockNames.includes(requiredBlock)) {
      warnings.push(
        `[Motion System] Template "${templateName}" is missing required block "${requiredBlock}".`
      );
    }
  });

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}
