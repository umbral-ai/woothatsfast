# WooThatsFast - WooCommerce Development & Optimization Services

A modern, high-performance website built with Astro and TailwindCSS for WooCommerce development and optimization services.

## 🚀 Quick Start

### For Developers

1. **Clone and Install**
```bash
git clone [repository-url]
cd [project-directory]
npm install
```

2. **Run Development Server**
```bash
npm run dev
```
This starts the development server at `http://localhost:3000`

3. **Build for Production**
```bash
npm run build
```

4. **Preview Production Build**
```bash
npm run preview
```

### Available Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run astro` | Run Astro CLI commands |

## 📝 Content Management

### Blog Posts

Blog posts are stored in `src/content/blog/` as Markdown files. Each post needs:

```markdown
---
title: "Your Post Title"
description: "Brief description of the post"
pubDate: 2024-01-25
author: "Author Name"
category: "Category Name"
featured: false
---

Your content here...
```

To add a new blog post:
1. Create a new `.md` file in `src/content/blog/`
2. Copy the above template
3. Fill in your content
4. Save the file

### Page Content

Main pages are located in `src/pages/` and use the `.astro` extension. Each page consists of:
- Page layout and structure
- Component imports
- Content sections

To modify page content:
1. Navigate to `src/pages/`
2. Find the relevant page (e.g., `about.astro`, `tools.astro`)
3. Edit the content within the markup

### Services & Pricing

Service information is stored in the page files. To update:

1. Open `src/pages/index.astro` for main services
2. Locate the pricing section
3. Modify the prices and features as needed

## 🎨 Styling

The site uses TailwindCSS for styling. Key files:

- `src/styles/global.css` - Global styles
- `tailwind.config.mjs` - TailwindCSS configuration

To modify styles:
1. Use Tailwind classes in components
2. Add custom styles to `global.css`
3. Modify theme settings in `tailwind.config.mjs`

## 📁 Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   ├── content/     # Blog posts and page content
│   ├── layouts/     # Page layouts
│   ├── pages/       # Page routes
│   └── styles/      # Global styles
└── package.json
```

## 🔧 Configuration

Key configuration files:

- `astro.config.mjs` - Astro configuration
- `tailwind.config.mjs` - TailwindCSS configuration
- `tsconfig.json` - TypeScript configuration

## 🖼️ Adding Images

1. Place images in the `public/` directory
2. Reference them in content using:
   - Markdown: `![Alt text](/image-name.jpg)`
   - Components: `<img src="/image-name.jpg" alt="Alt text" />`

## 🚀 Deployment

The site is configured to deploy to Cloudflare Pages:

1. Build command: `npm run build`
2. Output directory: `dist`
3. Environment variables are managed in Cloudflare Dashboard

## ⚡ Performance

The site is optimized for performance:
- Static site generation where possible
- Dynamic rendering for interactive components
- Image optimization via Cloudflare
- Responsive design for all devices

## 🤝 Getting Help

For technical issues:
1. Check the [Astro documentation](https://docs.astro.build)
2. Review [TailwindCSS documentation](https://tailwindcss.com/docs)
3. Contact the development team

For content updates:
1. Follow the content management guidelines above
2. Test changes in development environment
3. Request review before deploying to production

## 🔒 Security

- Keep dependencies updated
- Use secure content practices
- Follow deployment guidelines
- Maintain backup procedures

## 📱 Responsive Design

The site is fully responsive across devices:
- Mobile-first design
- Breakpoint system
- Flexible layouts
- Optimized images

## 🔄 Regular Maintenance

Recommended maintenance tasks:
1. Update dependencies monthly
2. Review and update content quarterly
3. Monitor performance metrics
4. Backup content regularly

## 📈 Analytics

Analytics are available through:
1. Cloudflare Analytics
2. Custom tracking implementation
3. Performance monitoring

## 🌐 Browser Support

The site supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## ⚖️ License

[Add your license information here]

---

For additional support or questions, please contact [your contact information].
