#!/bin/bash

# Create a deployment package
echo "Creating deployment package..."

# Create a temporary directory
mkdir -p temp_deploy

# Copy essential files
cp -r app components contexts data hooks lib public types utils temp_deploy/
cp next.config.js tailwind.config.ts tsconfig.json middleware.ts temp_deploy/

# Create package.json in the temp directory
cat > temp_deploy/package.json << 'EOL'
{
  "name": "broskiskitchen",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@stripe/react-stripe-js": "2.1.0",
    "@stripe/stripe-js": "2.1.0",
    "ai": "2.2.27",
    "clsx": "2.0.0",
    "date-fns": "2.30.0",
    "firebase": "10.1.0",
    "firebase-admin": "11.10.1",
    "framer-motion": "10.16.4",
    "lucide-react": "0.294.0",
    "next": "14.0.3",
    "nodemailer": "6.9.4",
    "react": "18.2.0",
    "react-day-picker": "8.9.1",
    "react-dom": "18.2.0",
    "react-hook-form": "7.45.4",
    "stripe": "13.2.0",
    "tailwind-merge": "1.14.0",
    "uuid": "9.0.0",
    "zod": "3.22.2"
  },
  "devDependencies": {
    "@types/node": "20.4.8",
    "@types/nodemailer": "6.4.9",
    "@types/react": "18.2.18",
    "@types/react-dom": "18.2.7",
    "@types/uuid": "9.0.2",
    "autoprefixer": "10.4.14",
    "eslint": "8.46.0",
    "eslint-config-next": "14.0.3",
    "postcss": "8.4.27",
    "tailwindcss": "3.3.3",
    "typescript": "5.1.6"
  }
}
EOL

# Create a simple .gitignore
cat > temp_deploy/.gitignore << 'EOL'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOL

# Create a README.md
cat > temp_deploy/README.md << 'EOL'
# Broski's Kitchen

A modern food ordering platform with age verification for infused products.
EOL

# Create a zip file
cd temp_deploy
zip -r ../broskiskitchen-deploy.zip .
cd ..

# Clean up
rm -rf temp_deploy

echo "Deployment package created: broskiskitchen-deploy.zip"
echo "Upload this file to Vercel using the instructions provided."
