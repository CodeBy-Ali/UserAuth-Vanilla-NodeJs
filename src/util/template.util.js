
export const populateTemplate = (template, bindings = {})=>{
  for (const [key, value] of Object.entries(bindings)) {
    template = template.replaceAll(`-[${key}]-`, value);
  }
  return template;
}
