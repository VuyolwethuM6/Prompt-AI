/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // AI-themed color palette
        'ai-primary': '#10B981',      // Vibrant emerald for primary actions
        'ai-secondary': '#6366F1',    // Indigo for secondary elements
        'ai-accent': '#F472B6',       // Pink for accents
        'ai-dark': '#0F172A',         // Dark blue for backgrounds
        'ai-light': '#E2E8F0',        // Light gray for text
        'ai-gradient-start': '#3B82F6', // Blue gradient start
        'ai-gradient-end': '#8B5CF6',   // Purple gradient end
        'ai-success': '#34D399',        // Green for success states
        'ai-warning': '#FBBF24',        // Yellow for warnings
        'ai-error': '#EF4444',          // Red for errors
        'ai-surface': 'rgba(255, 255, 255, 0.1)', // Glass effect surface
        'ai-border': 'rgba(255, 255, 255, 0.2)',  // Subtle borders
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'ai-glow': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'ai-neon': '0 0 20px rgba(99, 102, 241, 0.5)',
        'ai-glow': '0 0 30px rgba(16, 185, 129, 0.5)',
      },
      animation: {
        'ai-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ai-float': 'float 3s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
