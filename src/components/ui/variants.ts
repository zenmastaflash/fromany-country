export const buttonVariants = {
  // Primary - bright teal
  primary: "bg-primary hover:bg-primary-hover text-text focus:ring-primary",
  
  // Secondary - darker teal
  secondary: "bg-secondary hover:bg-secondary-dark text-text focus:ring-secondary",
  
  // Accent - reddish brown
  accent: "bg-accent hover:bg-primary text-text focus:ring-accent",
  
  // Outline style
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-text focus:ring-primary",
  
  // Ghost style
  ghost: "text-link hover:bg-secondary hover:text-text"
};

export const cardVariants = {
  default: "bg-secondary-dark rounded-lg shadow-lg p-6 text-text",
  raised: "bg-secondary-dark rounded-lg shadow-xl p-6 text-text border border-border",
  flat: "bg-background rounded-lg p-6 text-text border border-border"
};

export const inputVariants = {
  default: "bg-background border-border text-text placeholder-link rounded-md focus:ring-primary focus:border-primary",
  search: "bg-secondary border-border text-text placeholder-link rounded-full focus:ring-primary focus:border-primary"
};

export const linkVariants = {
  default: "text-link hover:text-primary underline",
  nav: "text-link hover:text-text",
  button: "inline-flex items-center justify-center px-4 py-2 bg-primary text-text rounded-md hover:bg-primary-hover"
};
