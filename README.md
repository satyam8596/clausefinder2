# ClauseFinder AI - Next.js Version

This is a Next.js implementation of the ClauseFinder AI application, a platform for automating legal contract review and analysis.

## Features

- AI-powered contract analysis
- Automatic clause extraction
- Risk assessment
- Dark/light mode theme support
- Responsive design
- 3D visualizations using Three.js

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js (via @react-three/fiber and @react-three/drei)
- **Theme Support**: next-themes
- **Icons**: Lucide React
- **Auth & Storage**: [Placeholder for actual implementation] Supabase

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                # App Router pages
│   ├── clauses/[id]/   # Dynamic clause report route
│   ├── dashboard/      # Dashboard page
│   ├── upload/         # Upload page
│   └── ...             # Other pages
├── components/         # Reusable components
│   ├── 3d/             # 3D visualization components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── providers/      # Context providers
└── ...
```

## Building for Production

```bash
npm run build
```

Then, you can start the production server:

```bash
npm run start
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

## License

[MIT](LICENSE) 