'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PromptEditor } from '@/components/PromptEditor';
import { Sidebar } from '@/components/Sidebar';
import type { CategoryType, PromptCard, TagType } from '@/types/promptbox';

// Mock data - in a real app, this would come from a database or API
const mockPrompts: PromptCard[] = [
  {
    id: 'creative-writing-assistant',
    title: 'Creative Writing Assistant',
    description:
      'A powerful prompt for generating creative stories, poems, and artistic content with vivid imagery and compelling narratives.',
    content: `# Creative Writing Assistant

## Overview
This prompt helps you generate creative stories, poems, and artistic content with vivid imagery and compelling narratives.

## Instructions
1. Choose your genre (fantasy, sci-fi, romance, etc.)
2. Define the main character with distinct traits
3. Set the scene and atmosphere using sensory details
4. Let creativity flow while maintaining narrative structure

## Example Usage
\`\`\`
Create a story about a time-traveling artist who discovers that their paintings can change the past. Focus on:
- The emotional impact of altering history
- Vivid descriptions of different time periods
- Character development through moral dilemmas
\`\`\`

## Tips for Better Results
- Use sensory details to make scenes vivid
- Focus on character development and internal conflicts
- Create emotional connections with readers
- Include dialogue that reveals personality
- Build tension through pacing and reveals

## Common Applications
- Short story creation
- Novel chapter development
- Poetry composition
- Character backstory generation
- World-building exercises`,
    rating: 2, // good
    tags: ['chatgpt', 'prompt', 'work'],
    categories: ['writing', 'vibe'],
    actions: { edit: true, delete: true, copy: true },
  },
  {
    id: 'frontend-code-generator',
    title: 'Frontend Code Generator',
    description:
      'Generate modern React components with TypeScript, Tailwind CSS, and best practices for responsive design.',
    content: `# Frontend Code Generator

## Purpose
Generate modern React components with TypeScript, Tailwind CSS, and best practices for responsive design.

## Key Features
- **TypeScript Support**: Full type safety and IntelliSense
- **Tailwind CSS Styling**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Modern React**: Hooks, functional components, and latest patterns
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized for speed and efficiency

## Usage Instructions
\`\`\`typescript
// Example: Generate a button component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:ring-2';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
\`\`\`

## Best Practices
1. **Component Structure**: Use functional components with TypeScript
2. **Props Interface**: Always define proper TypeScript interfaces
3. **Accessibility**: Include ARIA attributes and semantic HTML
4. **Performance**: Implement proper memoization where needed
5. **Styling**: Use Tailwind utilities with consistent design tokens
6. **Testing**: Write unit tests for all components

## Common Patterns
- **Compound Components**: For complex UI elements
- **Render Props**: For flexible component composition
- **Custom Hooks**: For reusable logic
- **Context API**: For state management
- **Error Boundaries**: For graceful error handling`,
    rating: 3, // excellent
    tags: ['super', 'work', 'vit'],
    categories: ['frontend'],
    actions: { edit: true, delete: true, copy: true },
  },
  {
    id: 'backend-api-designer',
    title: 'Backend API Designer',
    description:
      'Create robust REST APIs with proper authentication, validation, and documentation following industry standards.',
    content: `# Backend API Designer

## Overview
Create robust, scalable REST APIs with proper authentication, validation, error handling, and comprehensive documentation.

## Core Principles
- **RESTful Design**: Follow REST conventions and HTTP standards
- **Security First**: Implement proper authentication and authorization
- **Data Validation**: Validate all inputs and sanitize outputs
- **Error Handling**: Provide meaningful error responses
- **Documentation**: Auto-generated, interactive API documentation
- **Testing**: Comprehensive test coverage

## API Structure Template
\`\`\`javascript
// Express.js with TypeScript example
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Validation middleware
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/),
  body('name').trim().isLength({ min: 2, max: 50 })
];

// Routes
app.post('/api/users', validateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ 
      message: 'User created successfully', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
\`\`\`

## Security Checklist
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] HTTPS enforcement
- [ ] Secure headers (helmet.js)
- [ ] JWT token security
- [ ] Password hashing (bcrypt)
- [ ] Environment variables for secrets

## Response Format Standards
\`\`\`json
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [...]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

## Documentation Tools
- **Swagger/OpenAPI**: Interactive API documentation
- **Postman Collections**: Shareable API collections
- **API Blueprint**: Markdown-based documentation
- **Insomnia**: API testing and documentation`,
    rating: 2, // good
    tags: ['work', 'super'],
    categories: ['backend'],
    actions: { edit: true, delete: true, copy: true },
  },
  {
    id: 'digital-art-concept',
    title: 'Digital Art Concept',
    description:
      'Generate detailed prompts for AI art generation with specific styles, lighting, and composition instructions.',
    content: `# Digital Art Concept Generator

## Purpose
Generate detailed, professional prompts for AI art generation with specific styles, lighting, composition, and technical parameters.

## Prompt Structure Framework

### 1. Subject Description
- **Main Subject**: Primary focus of the artwork
- **Character Details**: Age, gender, expression, pose, clothing
- **Objects/Elements**: Secondary elements, props, symbols

### 2. Art Style & Medium
- **Art Movement**: Impressionism, Surrealism, Art Nouveau, etc.
- **Medium**: Oil painting, watercolor, digital art, photography
- **Artist Reference**: "in the style of [Artist Name]"

### 3. Composition & Framing
- **Shot Type**: Close-up, medium shot, wide shot, extreme wide
- **Angle**: Eye level, low angle, high angle, bird's eye
- **Rule of Thirds**: Placement of key elements

### 4. Lighting & Atmosphere
- **Lighting Type**: Golden hour, blue hour, dramatic, soft, harsh
- **Direction**: Front lit, backlit, side lit, rim lighting
- **Mood**: Mysterious, cheerful, melancholic, energetic

### 5. Color Palette
- **Primary Colors**: Dominant color scheme
- **Color Temperature**: Warm, cool, neutral
- **Saturation**: Vibrant, muted, desaturated

### 6. Technical Parameters
- **Quality**: 4K, 8K, high resolution, ultra detailed
- **Camera Settings**: Depth of field, bokeh, sharp focus
- **Post-Processing**: HDR, film grain, color grading

## Example Prompts

### Fantasy Portrait
\`\`\`
A mystical elven warrior with piercing blue eyes and flowing silver hair, 
wearing ornate leather armor with glowing runes, holding an enchanted sword, 
standing in an ancient forest clearing, 
cinematic lighting with golden sunbeams filtering through misty trees, 
magical particles floating in the air, 
hyperrealistic digital painting in the style of WLOP and Artgerm, 
8K resolution, dramatic composition, 
warm color palette with ethereal blue accents, 
shallow depth of field, 
fantasy art masterpiece
\`\`\`

### Sci-Fi Environment
\`\`\`
Futuristic cyberpunk cityscape at night, 
neon-lit skyscrapers reaching into storm clouds, 
flying cars with light trails, 
holographic advertisements floating in mid-air, 
rain-soaked streets reflecting colorful lights, 
moody atmospheric perspective, 
inspired by Blade Runner and Ghost in the Shell, 
dark color palette with vibrant neon accents, 
cinematic wide shot, 
dramatic lighting with volumetric fog, 
ultra detailed digital art, 
4K resolution, 
cyberpunk aesthetic
\`\`\`

### Nature Landscape
\`\`\`
Serene mountain lake at sunrise, 
mist rising from crystal clear water, 
reflecting snow-capped peaks and autumn foliage, 
a lone wooden dock extending into the lake, 
soft golden hour lighting, 
peaceful and tranquil atmosphere, 
landscape photography style, 
warm color temperature, 
high dynamic range, 
sharp focus throughout, 
Nature Photography Weekly award winner, 
Canon EOS R5, 24-70mm lens, 
f/11, ISO 100
\`\`\`

## Quality Enhancers
- **Technical**: 4K, 8K, ultra HD, high resolution, ultra detailed
- **Artistic**: Masterpiece, award winning, trending on ArtStation
- **Style**: Photorealistic, hyperrealistic, concept art, digital painting
- **Composition**: Rule of thirds, golden ratio, dynamic composition
- **Lighting**: Professional lighting, studio lighting, cinematic lighting

## Common Mistakes to Avoid
- Overloading with too many conflicting styles
- Vague or generic descriptions
- Ignoring aspect ratio requirements
- Not specifying lighting conditions
- Missing technical quality indicators
- Contradictory art styles or periods

## Platform-Specific Tips
- **Midjourney**: Use --ar for aspect ratio, --v for version
- **DALL-E**: Be specific about style and composition
- **Stable Diffusion**: Include negative prompts for better results
- **Leonardo AI**: Utilize preset styles and models`,
    rating: 1, // temp
    tags: ['prompt', 'vit'],
    categories: ['artist', 'vibe'],
    actions: { edit: true, delete: true, copy: true },
  },
];

function EditorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState<PromptCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true); // Default to show sidebar
  const [filters, setFilters] = useState({
    categories: ['ALL'],
    tags: ['ALL'],
  });

  const promptId = searchParams.get('id');
  const mode = promptId ? 'edit' : 'create';

  useEffect(() => {
    // Load filters from localStorage
    const filtersData = localStorage.getItem('promptbox_filters');
    if (filtersData) {
      try {
        const parsed = JSON.parse(filtersData);
        setFilters(parsed);
      } catch (_error) {}
    }

    if (promptId) {
      // In a real app, fetch the prompt from an API
      const foundPrompt = mockPrompts.find((p) => p.id === promptId);
      if (foundPrompt) {
        setPrompt(foundPrompt);
      } else {
        toast.error('Prompt not found');
        router.push('/');
        return;
      }
    } else {
      // Create new prompt with a unique ID
      setPrompt({
        id: `new-prompt-${Date.now()}`,
        title: '',
        description: '',
        content:
          '# New Prompt\n\nStart writing your prompt here...\n\n## Instructions\n\n1. Add your instructions here\n2. Provide examples\n3. Include tips and best practices\n',
        rating: 0, // No rating by default
        tags: [],
        categories: [],
        actions: { edit: true, delete: true, copy: true },
      });
    }
    setIsLoading(false);
  }, [promptId, router]);

  // Dummy handlers for sidebar (not functional in editor)
  const handleCategoryToggle = (_category: CategoryType) => {};
  const handleTagToggle = (_tag: TagType) => {};
  const handleCategoryDelete = (_category: CategoryType) => {};
  const handleTagDelete = (_tag: TagType) => {};

  const handleSave = (updatedPrompt: PromptCard) => {
    // Store the new categories and tags to localStorage for the main page to pick up
    // In a real app, this would be handled by a global state manager or API

    // Get current available filters to determine what's new
    const filtersData = localStorage.getItem('promptbox_filters');
    let existingCategories = [
      'ALL',
      'vibe',
      'artist',
      'writing',
      'frontend',
      'backend',
    ];
    let existingTags = ['ALL', 'chatgpt', 'super', 'prompt', 'work', 'vit'];

    if (filtersData) {
      try {
        const { categories, tags } = JSON.parse(filtersData);
        existingCategories = categories;
        existingTags = tags;
      } catch (_error) {}
    }

    const existingData = {
      newCategories: updatedPrompt.categories.filter(
        (cat) => !existingCategories.includes(cat),
      ),
      newTags: updatedPrompt.tags.filter((tag) => !existingTags.includes(tag)),
      prompt: updatedPrompt,
    };

    localStorage.setItem('promptEditor_data', JSON.stringify(existingData));

    toast.success(
      mode === 'create'
        ? `Prompt "${updatedPrompt.title}" created successfully!`
        : `Prompt "${updatedPrompt.title}" updated successfully!`,
    );
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!prompt) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      {showSidebar && (
        <div className="relative z-20">
          <Sidebar
            categories={filters.categories}
            prompts={mockPrompts}
            activeCategories={[]}
            activeTags={[]}
            onCategoryToggle={handleCategoryToggle}
            onTagToggle={handleTagToggle}
            onCategoryDelete={handleCategoryDelete}
            onTagDelete={handleTagDelete}
          />
        </div>
      )}

      {/* Editor */}
      <div className="flex-1">
        <PromptEditor
          prompt={prompt}
          mode={mode}
          onSave={handleSave}
          onCancel={handleCancel}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <EditorPageContent />
    </Suspense>
  );
}
