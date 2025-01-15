# Streamer

## Template Integrations
- Tailwind CSS v4 Beta 
- Astro SEO - Powered by [@astrolib/seo](https://github.com/onwidget/astrolib/tree/main/packages/seo)
- Astro Sitemap - https://docs.astro.build/en/guides/integrations-guide/sitemap/

## Template Structure

The template follows a typical Astro project structure. You'll find the following key directories and files:


```
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

- `src/pages/`: Contains `.astro` and `.md` files. Each file becomes a route in your project based on its name.
- `src/components/`: Ideal for placing your Astro/React/Vue/Svelte/Preact components.
- `public/`: For static assets such as images that you want to serve directly.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

Learn more - Explore more through Astro's official [documentation](https://docs.astro.build).

------
Updated on 21st October 2024

## This update includes:

- Added Tailwind CSS v4 Beta
- Vanialla JS animation on Intro file 

On this version, Tailwind CSS is now beta the alpha version from Tailwind CSS V4, this means that there's no `tailwind.config.mjs` file anymore. From now on, all style will be added on the `css` file. You can find the styles on the `src/styles/global.css` file.


- Astro SEO by @astrolib/seo
This update includes the integration of the Astro SEO package by @astrolib/seo, is an integration that makes managing your SEO easier in Astro projects. It is fully based on the excellent Next SEO library

- Reusable components
This template now includes reusable components, such as the `Text` component:

- Text Component
A flexible and reusable typography component for dynamic text elements. It allows you to:

- Dynamically set the HTML tag (e.g., `h1`, `p`, `span`) via the `tag` prop.
- Apply predefined text styling variants (e.g., `displayXL`, `textMD`) for consistency across your project.
- Add custom classes for additional styling with the `class` prop.

Example usage:
```astro
<Text tag="h1" variant="displayXL" class="text-center">
  Welcome to the new version!
</Text>
```
-----

### [Support](https://lexingtonthemes.com/legal/support/)
### [Documentation](https://lexingtonthemes.com/documentation/quick-start/)
### [Get your bundle](https://lexingtonthemes.com)
